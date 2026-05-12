"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X, Star, Link as LinkIcon, ArrowUp, ArrowDown } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

type ImageEntry = {
  url: string;
  uploading?: boolean;
  error?: string;
};

function uniqueFilename(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${stamp}-${rand}.${ext}`;
}

export function ImageManager({
  initialCover,
  initialGallery,
}: {
  initialCover: string | null | undefined;
  initialGallery: string[] | null | undefined;
}) {
  const initial: ImageEntry[] = [
    ...(initialCover ? [{ url: initialCover }] : []),
    ...(initialGallery ?? [])
      .filter((u) => u && u !== initialCover)
      .map((url) => ({ url })),
  ];
  const [items, setItems] = useState<ImageEntry[]>(initial);
  const [urlInput, setUrlInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cover = items[0]?.url ?? "";
  const gallery = items.slice(1).map((i) => i.url);

  async function uploadFiles(files: File[]) {
    const valid = files.filter((f) => f.type.startsWith("image/"));
    if (valid.length === 0) return;

    // Insert placeholders first so the user sees progress.
    const placeholders: ImageEntry[] = valid.map(() => ({
      url: "",
      uploading: true,
    }));
    setItems((prev) => [...prev, ...placeholders]);
    const startIndex = items.length;

    const supabase = createSupabaseBrowser();

    await Promise.all(
      valid.map(async (file, idx) => {
        const path = `tours/${uniqueFilename(file)}`;
        const { error } = await supabase.storage
          .from("tour-images")
          .upload(path, file, { cacheControl: "31536000", upsert: false });

        if (error) {
          setItems((prev) =>
            prev.map((item, i) =>
              i === startIndex + idx
                ? { url: "", uploading: false, error: error.message }
                : item,
            ),
          );
          return;
        }

        const { data } = supabase.storage.from("tour-images").getPublicUrl(path);
        setItems((prev) =>
          prev.map((item, i) =>
            i === startIndex + idx ? { url: data.publicUrl } : item,
          ),
        );
      }),
    );
  }

  function addUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, { url: trimmed }]);
    setUrlInput("");
  }

  function removeAt(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function moveTo(index: number, target: number) {
    setItems((prev) => {
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  }

  function setAsCover(index: number) {
    moveTo(index, 0);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) uploadFiles(files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  return (
    <div className="space-y-3">
      {/* Hidden fields submitted with the form */}
      <input type="hidden" name="cover_image" value={cover} />
      <input type="hidden" name="gallery" value={gallery.join("\n")} />

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-5 py-6 text-center transition-colors ${
          dragOver
            ? "border-navy-700 bg-navy-50"
            : "border-border-subtle bg-surface-alt hover:bg-white hover:border-navy-700/40"
        }`}
      >
        <div className="grid place-items-center w-10 h-10 mx-auto rounded-full bg-brand-yellow-soft text-navy-700">
          <Upload className="w-5 h-5" />
        </div>
        <p className="mt-2 text-[13.5px] font-semibold text-text-strong">
          Arraste imagens aqui ou clique para selecionar
        </p>
        <p className="text-[12px] text-text-muted">
          JPG / PNG / WEBP — até 10 MB cada — várias de uma vez
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) uploadFiles(files);
            e.target.value = "";
          }}
        />
      </div>

      {/* External URL */}
      <div className="flex items-stretch gap-2">
        <div className="flex-1 flex items-center gap-2 rounded-lg border border-border-subtle bg-white px-3 focus-within:border-navy-700">
          <LinkIcon className="w-4 h-4 text-text-muted shrink-0" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="…ou cole a URL de uma imagem externa"
            className="flex-1 py-2 text-[13.5px] outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
          />
        </div>
        <button
          type="button"
          onClick={addUrl}
          className="bg-white border border-border-subtle rounded-lg px-3 text-[13px] font-semibold text-text-strong hover:bg-surface-alt"
        >
          Adicionar
        </button>
      </div>

      {/* Thumbnails */}
      {items.length > 0 ? (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item, i) => (
            <li
              key={`${item.url}-${i}`}
              className="relative rounded-xl border border-border-subtle overflow-hidden bg-white group"
            >
              <div className="relative aspect-[4/3] bg-surface-alt">
                {item.uploading ? (
                  <div className="absolute inset-0 grid place-items-center text-text-muted">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : item.error ? (
                  <div className="absolute inset-0 grid place-items-center px-2 text-center text-[11.5px] text-red-600">
                    {item.error}
                  </div>
                ) : item.url ? (
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 200px"
                    className="object-cover"
                    unoptimized={!item.url.includes("supabase.co")}
                  />
                ) : null}
                {i === 0 && !item.uploading && !item.error ? (
                  <span className="absolute top-2 left-2 bg-brand-yellow text-navy-900 text-[10.5px] font-bold uppercase tracking-wide px-2 py-0.5 rounded">
                    Capa
                  </span>
                ) : null}
              </div>
              <div className="px-2 py-1.5 flex items-center justify-between gap-1 border-t border-border-subtle">
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveTo(i, i - 1)}
                    disabled={i === 0}
                    className="grid place-items-center w-7 h-7 rounded text-text-muted hover:text-text-strong hover:bg-surface-alt disabled:opacity-30"
                    title="Mover para cima"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTo(i, i + 1)}
                    disabled={i === items.length - 1}
                    className="grid place-items-center w-7 h-7 rounded text-text-muted hover:text-text-strong hover:bg-surface-alt disabled:opacity-30"
                    title="Mover para baixo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  {i !== 0 && !item.uploading && !item.error ? (
                    <button
                      type="button"
                      onClick={() => setAsCover(i)}
                      className="grid place-items-center w-7 h-7 rounded text-text-muted hover:text-navy-900 hover:bg-surface-alt"
                      title="Definir como capa"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="grid place-items-center w-7 h-7 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                  title="Remover"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
