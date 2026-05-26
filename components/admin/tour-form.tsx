"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Languages, Loader2, Save, Sparkles, LayoutTemplate, Layers } from "lucide-react";
import { upsertTour, type TourFormState } from "@/app/admin/passeios/actions";
import { autoTranslateTour } from "@/app/admin/passeios/translate-action";
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
  const [transLang, setTransLang] = useState<"pt" | "fr">("pt");
  const [translating, setTranslating] = useState(false);
  const [transError, setTransError] = useState("");

  // Refs to read EN source fields and write into translated fields
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAutoTranslate() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const title = String(fd.get("title") ?? "").trim();
    const shortDesc = String(fd.get("short_description") ?? "").trim();
    const desc = String(fd.get("description") ?? "").trim();
    const highlights = String(fd.get("highlights") ?? "").split("\n").map(s => s.trim()).filter(Boolean);

    if (!title) { setTransError("Preencha o título em inglês antes de traduzir."); return; }

    setTranslating(true);
    setTransError("");
    const deepLLang = transLang === "pt" ? "PT" : "FR";
    const result = await autoTranslateTour(deepLLang, title, shortDesc, desc, highlights);
    setTranslating(false);

    if (!result.ok) { setTransError(result.error ?? "Erro ao traduzir."); return; }

    // Write results into the hidden inputs / textareas via DOM
    const form = formRef.current;
    const set = (name: string, value: string) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
      if (el) { el.value = value; el.dispatchEvent(new Event("input", { bubbles: true })); }
    };
    if (transLang === "pt") {
      set("title_pt", result.title ?? "");
      set("short_description_pt", result.short_description ?? "");
      set("description_pt", result.description ?? "");
      set("highlights_pt", result.highlights?.join("\n") ?? "");
    } else {
      set("title_fr", result.title ?? "");
      set("short_description_fr", result.short_description ?? "");
      set("description_fr", result.description ?? "");
      set("highlights_fr", result.highlights?.join("\n") ?? "");
    }
  }

  return (
    <form ref={formRef} action={action} className="space-y-6">
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

      <Section title="Preço">
        <p className="text-[12.5px] text-text-muted -mt-2">
          Preencha para exibir preço nos cards. Deixe em branco para ocultar.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Preço base (EUR)">
            <input name="price_brl" type="number" step="0.01" defaultValue={tour?.price_brl ?? ""} className={fieldClass} placeholder="Ex: 145" />
          </Field>
          <Field label="A partir de (EUR)">
            <input name="price_from_brl" type="number" step="0.01" defaultValue={tour?.price_from_brl ?? ""} className={fieldClass} placeholder="Ex: 89" />
          </Field>
          <Field label=" ">
            <div className="flex items-center gap-2 mt-2">
              <Toggle name="hide_price" label="Ocultar preço nos cards" defaultChecked={tour?.hide_price ?? false} />
            </div>
          </Field>
        </div>
      </Section>

      <Section title="Publicação">
        <div className="flex flex-wrap gap-5">
          <Toggle name="free_cancellation" label="Cancelamento gratuito" defaultChecked={tour?.free_cancellation ?? true} />
          <Toggle name="is_featured" label="Destacar na home" defaultChecked={tour?.is_featured ?? false} />
          <Toggle name="is_published" label="Publicar no site" defaultChecked={tour?.is_published ?? true} />
        </div>
      </Section>

      {/* Languages — always visible */}
      <Section title="Idiomas do passeio">
        <Field label="Idiomas disponíveis (um por linha)">
          <textarea
            name="languages"
            defaultValue={tour?.languages?.join("\n") ?? ""}
            rows={3}
            className={fieldClass}
            placeholder={"Português\nEnglish\nFrançais\nEspañol"}
          />
        </Field>
        <p className="mt-2 text-[12px] text-text-muted leading-snug bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          💡 <strong>Dica:</strong> O inglês é o idioma principal — preencha o título, descrição e destaques em inglês nos campos acima. Use a secção abaixo para traduzir para Português e Francês.
        </p>
      </Section>

      {/* Translations — always visible */}
      <Section title="Traduções dos textos (PT / FR)">
        <p className="text-[12.5px] text-text-muted -mt-2">
          ✨ <strong>Automático:</strong> ao guardar o passeio, os campos em branco são preenchidos automaticamente via DeepL. Use o botão abaixo para re-traduzir após editar o texto em inglês.
        </p>

        {/* Tab switcher + auto-translate */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {(["pt", "fr"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setTransLang(lang)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold border transition-colors ${
                transLang === lang
                  ? "bg-navy-800 text-white border-navy-800"
                  : "bg-white text-text-strong border-border-subtle hover:bg-surface-alt"
              }`}
            >
              {lang === "pt" ? "🇵🇹 Português" : "🇫🇷 Français"}
            </button>
          ))}
          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={translating}
            className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold border border-navy-300 bg-navy-50 text-navy-800 hover:bg-navy-100 disabled:opacity-50 transition-colors"
          >
            {translating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
            {translating ? "A traduzir..." : `Auto-traduzir para ${transLang === "pt" ? "PT" : "FR"}`}
          </button>
        </div>
        {transError ? (
          <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{transError}</p>
        ) : null}

        {/* PT fields */}
        <div className={transLang === "pt" ? "space-y-4 mt-3" : "hidden"}>
          <Field label="Título (PT)">
            <input
              name="title_pt"
              defaultValue={tour?.title_pt ?? ""}
              className={fieldClass}
              placeholder="Título em português"
            />
          </Field>
          <Field label="Descrição curta (PT)">
            <input
              name="short_description_pt"
              defaultValue={tour?.short_description_pt ?? ""}
              className={fieldClass}
              placeholder="Resumo de uma frase em português"
            />
          </Field>
          <Field label="Descrição completa (PT)">
            <textarea
              name="description_pt"
              defaultValue={tour?.description_pt ?? ""}
              rows={5}
              className={fieldClass}
              placeholder="Descrição detalhada em português..."
            />
          </Field>
          <Field label="Destaques (PT) — um por linha">
            <textarea
              name="highlights_pt"
              defaultValue={tour?.highlights_pt?.join("\n") ?? ""}
              rows={4}
              className={fieldClass}
              placeholder={"Inclui equipamento de segurança\nGuia especializado incluído\nAdequado para todas as idades"}
            />
          </Field>
        </div>

        {/* FR fields */}
        <div className={transLang === "fr" ? "space-y-4 mt-3" : "hidden"}>
          <Field label="Titre (FR)">
            <input
              name="title_fr"
              defaultValue={tour?.title_fr ?? ""}
              className={fieldClass}
              placeholder="Titre en français"
            />
          </Field>
          <Field label="Description courte (FR)">
            <input
              name="short_description_fr"
              defaultValue={tour?.short_description_fr ?? ""}
              className={fieldClass}
              placeholder="Résumé en une phrase en français"
            />
          </Field>
          <Field label="Description complète (FR)">
            <textarea
              name="description_fr"
              defaultValue={tour?.description_fr ?? ""}
              rows={5}
              className={fieldClass}
              placeholder="Description détaillée en français..."
            />
          </Field>
          <Field label="Points forts (FR) — un par ligne">
            <textarea
              name="highlights_fr"
              defaultValue={tour?.highlights_fr?.join("\n") ?? ""}
              rows={4}
              className={fieldClass}
              placeholder={"Équipement de sécurité inclus\nGuide expert inclus\nConvient à tous les âges"}
            />
          </Field>
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
              <Section title="Avaliações (opcional)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Field label="O que não está incluído (um por linha)">
                  <textarea name="not_included" defaultValue={tour?.not_included?.join("\n") ?? ""} rows={4} className={fieldClass} />
                </Field>
              </Section>

              <Section title="Informações adicionais (opcional)">
                <Field label="Informação Importante">
                  <textarea
                    name="important_info"
                    defaultValue={tour?.important_info ?? ""}
                    rows={4}
                    className={fieldClass}
                    placeholder="Ex: Este passeio não é adequado para grávidas ou pessoas com problemas cardíacos..."
                  />
                </Field>
                <Field label="O que trazer">
                  <textarea
                    name="what_to_bring"
                    defaultValue={tour?.what_to_bring ?? ""}
                    rows={4}
                    className={fieldClass}
                    placeholder={"Ex:\nProtetor solar\nÁgua\nCalçado confortável"}
                  />
                </Field>
                <Field label="Dicas">
                  <textarea
                    name="tips"
                    defaultValue={tour?.tips ?? ""}
                    rows={4}
                    className={fieldClass}
                    placeholder="Ex: Reserve com antecedência nos meses de verão..."
                  />
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
