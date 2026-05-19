"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { upsertPartner, type PartnerFormState } from "@/app/admin/parceiros/actions";

const initial: PartnerFormState = {};

const fc =
  "w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 bg-white";

type Partner = {
  id?: string;
  name?: string;
  website?: string | null;
  contact_email?: string | null;
  phone?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  rezdy_alias?: string | null;
  logo_url?: string | null;
  description?: string | null;
  commission_pct?: number | null;
  is_active?: boolean;
  notes?: string | null;
};

export function PartnerForm({ partner }: { partner?: Partner | null }) {
  const [state, action, pending] = useActionState(upsertPartner, initial);

  return (
    <form action={action} className="space-y-6">
      {partner?.id ? <input type="hidden" name="id" value={partner.id} /> : null}

      <section className="bg-white border border-border-subtle rounded-2xl p-5 space-y-4">
        <h2 className="text-[15px] font-bold text-text-strong">Informações principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome do parceiro" required>
            <input name="name" defaultValue={partner?.name ?? ""} required className={fc} placeholder="Ex. Algarve Buggy Tours" />
          </Field>
          <Field label="Site">
            <input name="website" defaultValue={partner?.website ?? ""} className={fc} placeholder="https://parceiro.com" />
          </Field>
          <Field label="E-mail de contacto">
            <input name="contact_email" type="email" defaultValue={partner?.contact_email ?? ""} className={fc} placeholder="contato@parceiro.com" />
          </Field>
          <Field label="Telefone / WhatsApp">
            <input name="phone" defaultValue={partner?.phone ?? ""} className={fc} placeholder="+351 912 345 678" />
          </Field>
          <Field label="Instagram">
            <input name="instagram" defaultValue={partner?.instagram ?? ""} className={fc} placeholder="@parceiro ou https://instagram.com/..." />
          </Field>
          <Field label="WhatsApp Business (número)">
            <input name="whatsapp" defaultValue={partner?.whatsapp ?? ""} className={fc} placeholder="+351 912 345 678" />
          </Field>
        </div>
        <Field label="Descrição / notas públicas">
          <textarea name="description" defaultValue={partner?.description ?? ""} rows={3} className={fc} placeholder="Breve apresentação do parceiro (aparece no perfil)" />
        </Field>
      </section>

      <section className="bg-white border border-border-subtle rounded-2xl p-5 space-y-4">
        <h2 className="text-[15px] font-bold text-text-strong">Integração e comissões</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Alias Rezdy (subdomain)">
            <input name="rezdy_alias" defaultValue={partner?.rezdy_alias ?? ""} className={fc} placeholder="yourguidealgarve" />
          </Field>
          <Field label="Comissão (%)">
            <input name="commission_pct" type="number" step="0.01" min="0" max="100" defaultValue={partner?.commission_pct ?? ""} className={fc} placeholder="15" />
          </Field>
          <Field label="URL do logotipo">
            <input name="logo_url" defaultValue={partner?.logo_url ?? ""} className={fc} placeholder="https://..." />
          </Field>
        </div>
        <Field label="Notas internas (não aparecem no site)">
          <textarea name="notes" defaultValue={partner?.notes ?? ""} rows={2} className={fc} placeholder="Acordos, condições especiais..." />
        </Field>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_active" defaultChecked={partner?.is_active ?? true} className="w-4 h-4 accent-navy-800" />
          <span className="text-[13px] text-text-strong">Parceiro ativo</span>
        </label>
      </section>

      {state.error ? (
        <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{state.error}</p>
      ) : null}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-5 py-2.5 rounded-lg text-[14px] flex items-center gap-2 disabled:opacity-60">
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {partner?.id ? "Salvar alterações" : "Cadastrar parceiro"}
        </button>
        <Link href="/admin/parceiros" className="text-[13.5px] text-text-muted hover:text-text-strong">
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12.5px] font-semibold text-text-strong">
        {label}{required ? <span className="text-red-500"> *</span> : null}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
