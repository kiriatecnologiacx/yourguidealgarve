"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { upsertTour, type TourFormState } from "@/app/admin/passeios/actions";
import type { Category, Destination, Partner, Tour } from "@/lib/types";

const initial: TourFormState = {};

type Props = {
  tour?: Tour | null;
  categories: Category[];
  destinations: Destination[];
  partners: Partner[];
};

export function TourForm({ tour, categories, destinations, partners }: Props) {
  const [state, action, pending] = useActionState(upsertTour, initial);

  return (
    <form action={action} className="space-y-6">
      {tour ? <input type="hidden" name="id" value={tour.id} /> : null}

      <Section title="Informações básicas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Título" required>
            <input
              name="title"
              defaultValue={tour?.title ?? ""}
              required
              className={fieldClass}
              placeholder="Passeio de barco às Grutas de Benagil"
            />
          </Field>
          <Field label="Slug (URL)">
            <input
              name="slug"
              defaultValue={tour?.slug ?? ""}
              className={fieldClass}
              placeholder="passeio-grutas-benagil"
            />
          </Field>
          <Field label="Categoria">
            <select
              name="category_id"
              defaultValue={tour?.category_id ?? ""}
              className={fieldClass}
            >
              <option value="">— selecione —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Destino">
            <select
              name="destination_id"
              defaultValue={tour?.destination_id ?? ""}
              className={fieldClass}
            >
              <option value="">— selecione —</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Parceiro">
            <select
              name="partner_id"
              defaultValue={tour?.partner_id ?? ""}
              className={fieldClass}
            >
              <option value="">— selecione —</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Duração">
            <input
              name="duration"
              defaultValue={tour?.duration ?? ""}
              className={fieldClass}
              placeholder="2 horas"
            />
          </Field>
          <Field label="Descrição curta">
            <input
              name="short_description"
              defaultValue={tour?.short_description ?? ""}
              className={fieldClass}
              placeholder="Resumo de uma frase"
            />
          </Field>
          <Field label="Selo (badge)">
            <input
              name="badge"
              defaultValue={tour?.badge ?? ""}
              className={fieldClass}
              placeholder="Mais reservado, Novo, etc"
            />
          </Field>
        </div>

        <Field label="Descrição completa">
          <textarea
            name="description"
            defaultValue={tour?.description ?? ""}
            rows={5}
            className={fieldClass}
          />
        </Field>
      </Section>

      <Section title="Mídia">
        <Field label="Imagem de capa (URL)" required>
          <input
            name="cover_image"
            defaultValue={tour?.cover_image ?? ""}
            required
            className={fieldClass}
            placeholder="https://..."
          />
        </Field>
        <Field label="Galeria (URLs separadas por vírgula ou linha)">
          <textarea
            name="gallery"
            defaultValue={tour?.gallery?.join("\n") ?? ""}
            rows={4}
            className={fieldClass}
          />
        </Field>
      </Section>

      <Section title="Preço e avaliações">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Field label="Preço (BRL)" required>
            <input
              name="price_brl"
              type="number"
              step="1"
              defaultValue={tour?.price_brl ?? ""}
              required
              className={fieldClass}
            />
          </Field>
          <Field label="Preço a partir de (BRL)">
            <input
              name="price_from_brl"
              type="number"
              step="1"
              defaultValue={tour?.price_from_brl ?? ""}
              className={fieldClass}
            />
          </Field>
          <Field label="Avaliação (0-5)">
            <input
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              defaultValue={tour?.rating ?? ""}
              className={fieldClass}
            />
          </Field>
          <Field label="Nº de avaliações">
            <input
              name="reviews_count"
              type="number"
              defaultValue={tour?.reviews_count ?? 0}
              className={fieldClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Detalhes da experiência">
        <Field label="Ponto de encontro">
          <input
            name="meeting_point"
            defaultValue={tour?.meeting_point ?? ""}
            className={fieldClass}
            placeholder="Marina de Lagos, 8600-315 Lagos, Portugal"
          />
        </Field>
        <Field label="Destaques (uma por linha)">
          <textarea
            name="highlights"
            defaultValue={tour?.highlights?.join("\n") ?? ""}
            rows={4}
            className={fieldClass}
          />
        </Field>
        <Field label="O que está incluído (um por linha)">
          <textarea
            name="included"
            defaultValue={tour?.included?.join("\n") ?? ""}
            rows={4}
            className={fieldClass}
          />
        </Field>
      </Section>

      <Section title="Afiliado e publicação">
        <Field label="URL do link de afiliado" required>
          <input
            name="affiliate_url"
            defaultValue={tour?.affiliate_url ?? ""}
            required
            className={fieldClass}
            placeholder="https://parceiro.com/?ref=youguidealgarve"
          />
        </Field>

        <div className="flex flex-wrap gap-5 pt-2">
          <Toggle
            name="free_cancellation"
            label="Cancelamento gratuito"
            defaultChecked={tour?.free_cancellation ?? true}
          />
          <Toggle
            name="is_featured"
            label="Destacar na home"
            defaultChecked={tour?.is_featured ?? false}
          />
          <Toggle
            name="is_published"
            label="Publicar no site"
            defaultChecked={tour?.is_published ?? true}
          />
        </div>
      </Section>

      {state.error ? (
        <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-5 py-2.5 rounded-lg text-[14px] flex items-center gap-2 disabled:opacity-60"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {tour ? "Salvar alterações" : "Cadastrar passeio"}
        </button>
        <Link
          href="/admin/passeios"
          className="text-[13.5px] text-text-muted hover:text-text-strong"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

const fieldClass =
  "w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 bg-white";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-border-subtle rounded-2xl p-5 space-y-4">
      <h2 className="text-[15px] font-bold text-text-strong">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[12.5px] font-semibold text-text-strong">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="w-4 h-4 accent-navy-800"
      />
      <span className="text-[13px] text-text-strong">{label}</span>
    </label>
  );
}
