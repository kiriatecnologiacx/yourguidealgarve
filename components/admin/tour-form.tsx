"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Loader2, Save, Sparkles, LayoutTemplate, Layers } from "lucide-react";
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
  const [mode, setMode] = useState<"widget" | "complete">(
    tour?.tour_mode ?? "widget",
  );
  const [showAdvanced, setShowAdvanced] = useState(
    !!(tour?.description || tour?.gallery?.length || tour?.highlights?.length || tour?.meeting_point),
  );

  return (
    <form action={action} className="space-y-6">
      {tour ? <input type="hidden" name="id" value={tour.id} /> : null}
      <input type="hidden" name="tour_mode" value={mode} />

      {/* Mode selector */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMode("widget")}
          className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
            mode === "widget"
              ? "border-navy-700 bg-navy-800 text-white"
              : "border-border-subtle bg-white text-text-strong hover:bg-surface-alt"
          }`}
        >
          <LayoutTemplate className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13.5px] font-bold">Widget + capa</p>
            <p className={`text-[12px] mt-0.5 ${mode === "widget" ? "text-white/70" : "text-text-muted"}`}>
              Widget do parceiro embutido no site. Rápido de configurar.
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setMode("complete")}
          className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
            mode === "complete"
              ? "border-navy-700 bg-navy-800 text-white"
              : "border-border-subtle bg-white text-text-strong hover:bg-surface-alt"
          }`}
        >
          <Layers className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13.5px] font-bold">Completo</p>
            <p className={`text-[12px] mt-0.5 ${mode === "complete" ? "text-white/70" : "text-text-muted"}`}>
              Descrição, fotos, destaques e botão de reserva próprio.
            </p>
          </div>
        </button>
      </div>

      {/* Common fields */}
      <Section title="Informações principais">
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
            <select name="category_id" defaultValue={tour?.category_id ?? ""} className={fieldClass}>
              <option value="">— selecione —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Destino">
            <select name="destination_id" defaultValue={tour?.destination_id ?? ""} className={fieldClass}>
              <option value="">— selecione —</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* Cover image — always visible */}
      <Section title="Imagem de capa">
        <p className="text-[12.5px] text-text-muted -mt-2">
          {mode === "widget"
            ? "Aparece no card do passeio na listagem e no topo da página."
            : "Opcional. Adicione fotos para aparecer nos cards e na página do passeio."}
        </p>
        <ImageManager
          initialCover={tour?.cover_image}
          initialGallery={mode === "complete" ? (tour?.gallery) : []}
          hideGallery={mode === "widget"}
        />
      </Section>

      {/* Widget section — always visible */}
      <Section title="Widget de reserva" icon={<Sparkles className="w-4 h-4 text-brand-orange" />}>
        {mode === "widget" ? (
          <p className="text-[12.5px] text-text-muted -mt-2">
            O widget será <strong>embutido diretamente no site</strong>, ocupando toda a largura da página.
            Cole a URL ou snippet do parceiro (Rezdy, FareHarbor, Viator…).{" "}
            <Link href="/admin/ajuda" className="text-navy-700 underline hover:text-navy-900">
              Como pegar o widget →
            </Link>
          </p>
        ) : (
          <p className="text-[12.5px] text-text-muted -mt-2">
            <strong>Opcional.</strong> Cole o widget do parceiro — funciona com Rezdy, FareHarbor, Viator e outros.{" "}
            <Link href="/admin/ajuda" className="text-navy-700 underline hover:text-navy-900">
              Como pegar o widget →
            </Link>
          </p>
        )}
        <Field label="URL ou snippet do widget (Rezdy, FareHarbor, Viator…)">
          <textarea
            name="booking_widget_url"
            defaultValue={tour?.booking_widget_url ?? ""}
            rows={3}
            className={fieldClass + " font-mono text-[12.5px]"}
            placeholder={`https://yourguidealgarve.rezdy.com/calendarWidget/459753?iframe=true\n\nOu cole o <iframe ...> completo — extraímos a URL automaticamente.`}
          />
        </Field>
        {mode === "complete" ? (
          <>
            <Field label="Snippet HTML completo (avançado, opcional)">
              <textarea
                name="booking_widget_html"
                defaultValue={tour?.booking_widget_html ?? ""}
                rows={3}
                className={fieldClass + " font-mono text-[12.5px]"}
                placeholder="Use se o widget precisar de <script> próprio do parceiro."
              />
            </Field>
            <Field label="Link externo de reserva (opcional — abre em nova aba)">
              <input
                name="affiliate_url"
                defaultValue={tour?.affiliate_url ?? ""}
                className={fieldClass}
                placeholder="https://www.viator.com/tours/..."
              />
            </Field>
          </>
        ) : null}
      </Section>

      <Section title="Publicação">
        <div className="flex flex-wrap gap-5">
          <Toggle name="free_cancellation" label="Cancelamento gratuito" defaultChecked={tour?.free_cancellation ?? true} />
          <Toggle name="is_featured" label="Destacar na home" defaultChecked={tour?.is_featured ?? false} />
          <Toggle name="is_published" label="Publicar no site" defaultChecked={tour?.is_published ?? true} />
        </div>
      </Section>

      {/* Extra content — only in complete mode */}
      {mode === "complete" ? (
        <>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="w-full text-left flex items-center justify-between bg-white border border-border-subtle rounded-2xl px-5 py-4 hover:bg-surface-alt text-[13.5px] font-semibold text-text-strong"
          >
            <span>
              Conteúdo extra (preço, descrição, destaques) —{" "}
              <span className="text-text-muted font-normal">opcional</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>

          {showAdvanced ? (
            <>
              <Section title="Preço e avaliações (opcional)">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Field label="Preço (BRL)">
                    <input name="price_brl" type="number" step="1" defaultValue={tour?.price_brl ?? ""} className={fieldClass} />
                  </Field>
                  <Field label="Preço a partir de (BRL)">
                    <input name="price_from_brl" type="number" step="1" defaultValue={tour?.price_from_brl ?? ""} className={fieldClass} />
                  </Field>
                  <Field label="Avaliação (0-5)">
                    <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={tour?.rating ?? ""} className={fieldClass} />
                  </Field>
                  <Field label="Nº de avaliações">
                    <input name="reviews_count" type="number" defaultValue={tour?.reviews_count ?? 0} className={fieldClass} />
                  </Field>
                </div>
              </Section>

              <Section title="Texto e mídia (opcional)">
                <Field label="Duração">
                  <input name="duration" defaultValue={tour?.duration ?? ""} className={fieldClass} placeholder="90 min, 2 horas..." />
                </Field>
                <Field label="Descrição curta">
                  <input name="short_description" defaultValue={tour?.short_description ?? ""} className={fieldClass} placeholder="Resumo de uma frase" />
                </Field>
                <Field label="Descrição completa">
                  <textarea name="description" defaultValue={tour?.description ?? ""} rows={5} className={fieldClass} />
                </Field>
                <Field label="Parceiro">
                  <select name="partner_id" defaultValue={tour?.partner_id ?? ""} className={fieldClass}>
                    <option value="">— selecione —</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </Field>
              </Section>

              <Section title="Experiência (opcional)">
                <Field label="Ponto de encontro">
                  <input name="meeting_point" defaultValue={tour?.meeting_point ?? ""} className={fieldClass} placeholder="Marina de Lagos, 8600-315 Lagos" />
                </Field>
                <Field label="Destaques (uma por linha)">
                  <textarea name="highlights" defaultValue={tour?.highlights?.join("\n") ?? ""} rows={4} className={fieldClass} />
                </Field>
                <Field label="O que está incluído (um por linha)">
                  <textarea name="included" defaultValue={tour?.included?.join("\n") ?? ""} rows={4} className={fieldClass} />
                </Field>
              </Section>
            </>
          ) : null}
        </>
      ) : null}

      {state.error ? (
        <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center gap-3 pt-2 flex-wrap">
        <button
          type="submit"
          disabled={pending}
          className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-5 py-2.5 rounded-lg text-[14px] flex items-center gap-2 disabled:opacity-60"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {tour ? "Salvar alterações" : "Cadastrar passeio"}
        </button>
        {tour?.slug ? (
          <Link
            href={`/atividades/${tour.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 bg-white border border-border-subtle text-text-strong font-semibold px-4 py-2.5 rounded-lg text-[13.5px] hover:bg-surface-alt"
          >
            <ExternalLink className="w-4 h-4" />
            Pré-visualizar
          </Link>
        ) : null}
        <Link href="/admin/passeios" className="text-[13.5px] text-text-muted hover:text-text-strong">
          Cancelar
        </Link>
      </div>
    </form>
  );
}

const fieldClass =
  "w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 bg-white";

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-border-subtle rounded-2xl p-5 space-y-4">
      <h2 className="text-[15px] font-bold text-text-strong flex items-center gap-2">
        {icon}{title}
      </h2>
      {children}
    </section>
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

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="w-4 h-4 accent-navy-800" />
      <span className="text-[13px] text-text-strong">{label}</span>
    </label>
  );
}
