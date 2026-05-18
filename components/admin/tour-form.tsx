"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ChevronDown, Loader2, Save, Sparkles } from "lucide-react";
import { upsertTour, type TourFormState } from "@/app/admin/passeios/actions";
import type { Category, Destination, Partner, Tour } from "@/lib/types";
import { ImageManager } from "./image-manager";

const initial: TourFormState = {};

type Props = {
  tour?: Tour | null;
  categories: Category[];
  destinations: Destination[];
  partners: Partner[];
};

export function TourForm({ tour, categories, destinations, partners }: Props) {
  const [state, action, pending] = useActionState(upsertTour, initial);
  const [showAdvanced, setShowAdvanced] = useState(
    !!(tour?.description || tour?.gallery?.length || tour?.highlights?.length || tour?.meeting_point),
  );

  return (
    <form action={action} className="space-y-6">
      {tour ? <input type="hidden" name="id" value={tour.id} /> : null}

      <Section title="Informações principais">
        <p className="text-[12.5px] text-text-muted -mt-2 mb-2">
          O essencial pra criar o passeio. Se você usa widget Rezdy/FareHarbor/Pluralo,
          o restante do conteúdo (descrição, fotos, calendário) vem do próprio widget —
          basta preencher os campos abaixo.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Título" required>
            <input
              name="title"
              defaultValue={tour?.title ?? ""}
              required
              className={fieldClass}
              placeholder="Buggy Adventure 1.5H - Off-Road Tour from Albufeira"
            />
          </Field>
          <Field label="Slug (URL)">
            <input
              name="slug"
              defaultValue={tour?.slug ?? ""}
              className={fieldClass}
              placeholder="buggy-adventure-1-5h-albufeira"
            />
          </Field>
          <Field label="Selo (badge)">
            <input
              name="badge"
              defaultValue={tour?.badge ?? ""}
              className={fieldClass}
              placeholder="Best seller, New, Top rated..."
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
        </div>
      </Section>

      <Section title="Imagens">
        <p className="text-[12.5px] text-text-muted -mt-2">
          Opcional. Adicione fotos para aparecer nos cards e na página do
          passeio. Você pode arrastar várias imagens do seu computador, ou
          colar URLs externas. A primeira é a capa — pode reordenar.
        </p>
        <ImageManager
          initialCover={tour?.cover_image}
          initialGallery={tour?.gallery}
        />
      </Section>

      <Section title="Widget de reserva do parceiro" icon={<Sparkles className="w-4 h-4 text-brand-orange" />}>
        <p className="text-[12.5px] text-text-muted -mt-2">
          Cole o widget que você gerou no painel do parceiro (Rezdy, FareHarbor, Pluralo).
          Recomendado: <strong>Product Calendar / calendarWidget</strong> — fica embutido na lateral do
          passeio (data, hora, "Book now"). O checkout abre em popup, sem sair do site.
          Pode colar só a URL ou o snippet HTML completo — a gente extrai a URL.{" "}
          <Link href="/admin/ajuda" className="text-navy-700 underline hover:text-navy-900">
            Como pegar o widget →
          </Link>
        </p>
        <Field label="URL do widget (Rezdy/FareHarbor/Pluralo) — recomendado">
          <textarea
            name="booking_widget_url"
            defaultValue={tour?.booking_widget_url ?? ""}
            rows={3}
            className={fieldClass + " font-mono text-[12.5px]"}
            placeholder={`Ex. (calendarWidget — recomendado): https://yourguidealgarve.rezdy.com/calendarWidget/459753?iframe=true\nEx. (Product Details, abre em popup): https://yourguidealgarve.rezdy.com/45975J/...?iframe=true\n\nVocê também pode colar o snippet <iframe ...> completo que a gente extrai a URL.`}
          />
        </Field>
        <Field label="HTML completo do snippet (avançado, opcional)">
          <textarea
            name="booking_widget_html"
            defaultValue={tour?.booking_widget_html ?? ""}
            rows={4}
            className={fieldClass + " font-mono text-[12.5px]"}
            placeholder={"Use somente se a URL não bastar — por exemplo widgets que dependem do <script defer> do parceiro."}
          />
        </Field>
        <Field label="Link de afiliado (fallback, opcional)">
          <input
            name="affiliate_url"
            defaultValue={tour?.affiliate_url ?? ""}
            className={fieldClass}
            placeholder="https://parceiro.com/?ref=youguidealgarve"
          />
        </Field>
        <p className="text-[11.5px] text-text-muted">
          Pelo menos um dos três (URL, HTML ou link de afiliado) é obrigatório.
          A página do passeio mostra o widget grande, ocupando o conteúdo principal.
        </p>
      </Section>

      <Section title="Publicação">
        <div className="flex flex-wrap gap-5">
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

      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="w-full text-left flex items-center justify-between bg-white border border-border-subtle rounded-2xl px-5 py-4 hover:bg-surface-alt text-[13.5px] font-semibold text-text-strong"
      >
        <span>
          Conteúdo extra (preço, descrição, fotos, destaques) —{" "}
          <span className="text-text-muted font-normal">
            opcional. Só preencha se o widget não cobrir, ou se quiser
            complementar.
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            showAdvanced ? "rotate-180" : ""
          }`}
        />
      </button>

      {showAdvanced ? (
        <>
          <Section title="Preço e avaliações (opcional)">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field label="Preço (BRL)">
                <input
                  name="price_brl"
                  type="number"
                  step="1"
                  defaultValue={tour?.price_brl ?? ""}
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

          <Section title="Texto e mídia (opcional)">
            <Field label="Duração">
              <input
                name="duration"
                defaultValue={tour?.duration ?? ""}
                className={fieldClass}
                placeholder="90 min, 2 horas..."
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
            <Field label="Descrição completa">
              <textarea
                name="description"
                defaultValue={tour?.description ?? ""}
                rows={5}
                className={fieldClass}
              />
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
          </Section>

          <Section title="Experiência (opcional)">
            <Field label="Ponto de encontro">
              <input
                name="meeting_point"
                defaultValue={tour?.meeting_point ?? ""}
                className={fieldClass}
                placeholder="Marina de Lagos, 8600-315 Lagos"
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
        </>
      ) : null}

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

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-border-subtle rounded-2xl p-5 space-y-4">
      <h2 className="text-[15px] font-bold text-text-strong flex items-center gap-2">
        {icon}
        {title}
      </h2>
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
