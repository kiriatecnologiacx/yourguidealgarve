import Link from "next/link";
import { Plus } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";
import { DeleteRowButton } from "@/components/admin/delete-row-button";
import { deletePartner } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("partners")
    .select("*")
    .order("name", { ascending: true });
  const partners = data ?? [];

  return (
    <div className="px-6 lg:px-10 py-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text-strong">Parceiros</h1>
          <p className="text-[13.5px] text-text-muted mt-0.5">
            Empresas e operadores que fornecem os passeios listados no site.
          </p>
        </div>
        <Link
          href="/admin/parceiros/novo"
          className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-4 py-2.5 rounded-lg text-[13.5px] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo parceiro
        </Link>
      </div>

      <section className="mt-6 bg-white border border-border-subtle rounded-2xl overflow-x-auto">
        {partners.length === 0 ? (
          <p className="p-6 text-[13.5px] text-text-muted">Nenhum parceiro cadastrado.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-surface-alt text-[12px] uppercase tracking-wide text-text-muted">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Nome</th>
                <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Contacto</th>
                <th className="text-left px-5 py-3 font-semibold hidden lg:table-cell">Comissão</th>
                <th className="text-left px-5 py-3 font-semibold">Estado</th>
                <th className="text-right px-5 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {partners.map((p) => (
                <tr key={p.id} className="hover:bg-surface-alt">
                  <td className="px-5 py-3">
                    <p className="text-[13.5px] font-semibold text-text-strong">{p.name}</p>
                    {p.website ? (
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-navy-700 hover:underline"
                      >
                        {p.website.replace(/^https?:\/\//, "")}
                      </a>
                    ) : null}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-[13px] text-text-strong">
                    <p>{p.contact_email ?? "—"}</p>
                    {p.phone ? <p className="text-[12px] text-text-muted">{p.phone}</p> : null}
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-[13px] text-text-strong">
                    {p.commission_pct != null ? `${p.commission_pct}%` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[11.5px] font-semibold px-2 py-0.5 rounded-full ${
                      p.is_active !== false
                        ? "bg-green-100 text-green-700"
                        : "bg-surface-alt text-text-muted"
                    }`}>
                      {p.is_active !== false ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/parceiros/${p.id}`}
                        className="text-[12.5px] text-navy-700 hover:underline font-medium"
                      >
                        Editar
                      </Link>
                      <DeleteRowButton
                        id={p.id}
                        action={deletePartner}
                        label="Excluir este parceiro?"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
