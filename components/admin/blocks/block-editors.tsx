"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import type {
  Block, TextBlock, HeadingBlock, ImageBlock,
  ImageGridBlock, QuoteBlock, CTABlock,
} from "@/lib/blog-blocks";

const inputClass =
  "w-full rounded-lg border border-border-subtle px-3 py-2 text-[13.5px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 bg-white";
const labelClass = "text-[11.5px] font-semibold text-text-muted uppercase tracking-wide";

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/blog/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro no upload");
      onChange(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass + " flex-1"}
          placeholder="https://... ou faça upload abaixo"
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-subtle text-[12.5px] text-text-strong hover:bg-surface-alt disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          Upload
        </button>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
      {error ? <p className="text-[11.5px] text-red-600">{error}</p> : null}
      {value ? (
        <img src={value} alt="" className="h-20 w-auto rounded-lg object-cover border border-border-subtle" />
      ) : null}
    </div>
  );
}

export function TextBlockEditor({ block, onChange }: { block: TextBlock; onChange: (b: TextBlock) => void }) {
  return (
    <div className="space-y-1.5">
      <p className={labelClass}>Parágrafo</p>
      <textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        rows={4}
        className={inputClass + " resize-y"}
        placeholder="Escreva o parágrafo..."
      />
    </div>
  );
}

export function HeadingBlockEditor({ block, onChange }: { block: HeadingBlock; onChange: (b: HeadingBlock) => void }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        <p className={labelClass}>Título</p>
        <select
          value={block.level}
          onChange={(e) => onChange({ ...block, level: e.target.value as "h2" | "h3" })}
          className="rounded border border-border-subtle px-2 py-1 text-[12px] bg-white"
        >
          <option value="h2">H2 — Grande</option>
          <option value="h3">H3 — Médio</option>
        </select>
      </div>
      <input
        type="text"
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        className={inputClass}
        placeholder="Título da seção..."
      />
    </div>
  );
}

export function ImageBlockEditor({ block, onChange }: { block: ImageBlock; onChange: (b: ImageBlock) => void }) {
  return (
    <div className="space-y-2">
      <p className={labelClass}>Imagem</p>
      <ImageUploader value={block.url} onChange={(url) => onChange({ ...block, url })} />
      <input
        type="text"
        value={block.caption ?? ""}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
        className={inputClass}
        placeholder="Legenda (opcional)"
      />
    </div>
  );
}

export function ImageGridBlockEditor({ block, onChange }: { block: ImageGridBlock; onChange: (b: ImageGridBlock) => void }) {
  function updateImage(idx: number, url: string) {
    const images = block.images.map((img, i) => i === idx ? { ...img, url } : img);
    onChange({ ...block, images });
  }
  function setColumns(columns: 2 | 3) {
    let images = [...block.images];
    while (images.length < columns) images.push({ url: "", alt: "" });
    if (images.length > columns) images = images.slice(0, columns);
    onChange({ ...block, columns, images });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <p className={labelClass}>Grade de Imagens</p>
        <div className="flex gap-1">
          {([2, 3] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setColumns(n)}
              className={`px-2.5 py-1 rounded text-[12px] font-semibold border transition-colors ${block.columns === n ? "bg-navy-800 text-white border-navy-800" : "border-border-subtle text-text-muted hover:bg-surface-alt"}`}
            >
              {n} colunas
            </button>
          ))}
        </div>
      </div>
      <div className={`grid gap-2 ${block.columns === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {block.images.map((img, idx) => (
          <div key={idx}>
            <p className="text-[10.5px] text-text-muted mb-1">Imagem {idx + 1}</p>
            <ImageUploader value={img.url} onChange={(url) => updateImage(idx, url)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuoteBlockEditor({ block, onChange }: { block: QuoteBlock; onChange: (b: QuoteBlock) => void }) {
  return (
    <div className="space-y-2">
      <p className={labelClass}>Destaque / Quote</p>
      <textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        rows={3}
        className={inputClass + " resize-none"}
        placeholder="Texto em destaque..."
      />
      <input
        type="text"
        value={block.author ?? ""}
        onChange={(e) => onChange({ ...block, author: e.target.value })}
        className={inputClass}
        placeholder="Autor (opcional)"
      />
    </div>
  );
}

export function CTABlockEditor({ block, onChange }: { block: CTABlock; onChange: (b: CTABlock) => void }) {
  return (
    <div className="space-y-2">
      <p className={labelClass}>Botão CTA</p>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={block.label}
          onChange={(e) => onChange({ ...block, label: e.target.value })}
          className={inputClass}
          placeholder="Texto do botão"
        />
        <input
          type="url"
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          className={inputClass}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
