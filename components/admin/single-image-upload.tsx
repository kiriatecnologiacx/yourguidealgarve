"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X, Link as LinkIcon } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

function uniqueFilename(file: File, folder: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${folder}/${stamp}-${rand}.${ext}`;
}

export function SingleImageUpload({
  initialUrl,
  fieldName = "image",
  folder = "destinations",
}: {
  initialUrl?: string | null;
  fieldName?: string;
  folder?: string;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Apenas imagens são permitidas.");
      return;
    }
    setUploading(true);
    setError("");
    const supabase = createSupabaseBrowser();
    const path = uniqueFilename(file, folder);
    const { error: uploadError } = await supabase.storage
      .from("tour-images")
      .upload(path, file, { cacheControl: "31536000", upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("tour-images").getPublicUrl(path);
    setUrl(data.publicUrl);
    setUploading(false);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      <input type="hidden" name={fieldName} value={url} />

      {url ? (
        <div className="relative rounded-xl overflow-hidden border border-border-subtle bg-surface-alt group">
          <div className="relative w-full h-[160px]">
            <Image src={url} alt="" fill className="object-cover" unoptimized={!url.includes("supabase.co")} />
          </div>
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 hover:bg-white text-red-500 shadow"
            title="Remover imagem"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed px-5 py-6 text-center transition-colors ${
            dragOver ? "border-navy-700 bg-navy-50" : "border-border-subtle bg-surface-alt hover:bg-white hover:border-navy-700/40"
          }`}
        >
          <div className="grid place-items-center w-10 h-10 mx-auto rounded-full bg-brand-yellow-soft text-navy-700">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          </div>
          <p className="mt-2 text-[13.5px] font-semibold text-text-strong">
            {uploading ? "A carregar..." : "Arraste ou clique para fazer upload"}
          </p>
          <p className="text-[12px] text-text-muted">JPG / PNG / WEBP — até 10 MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {/* URL manual como alternativa */}
      <div className="flex items-stretch gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-lg border border-border-subtle bg-white px-3 focus-within:border-navy-700">
          <LinkIcon className="w-4 h-4 text-text-muted shrink-0" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Ou cole a URL de uma imagem"
            className="flex-1 py-2 text-[13.5px] outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (urlInput.trim()) { setUrl(urlInput.trim()); setUrlInput(""); }
              }
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => { if (urlInput.trim()) { setUrl(urlInput.trim()); setUrlInput(""); } }}
          className="bg-white border border-border-subtle rounded-lg px-3 text-[13px] font-semibold text-text-strong hover:bg-surface-alt"
        >
          Usar URL
        </button>
      </div>

      {error ? <p className="text-[12.5px] text-red-600">{error}</p> : null}
    </div>
  );
}
