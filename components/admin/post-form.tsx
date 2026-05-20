"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, Upload } from "lucide-react";
import { upsertPost } from "@/app/admin/blog/actions";
import type { BlogPost } from "@/lib/blog";
import type { Block } from "@/lib/blog-blocks";
import { BlockEditor } from "@/components/admin/blocks/block-editor";

const fieldClass =
  "w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 bg-white";

export function PostForm({ post }: { post?: BlogPost | null }) {
  const router = useRouter();
  const [blocks, setBlocks] = useState<Block[]>(post?.content ?? []);
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  async function uploadCover(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/blog/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro no upload");
      setCoverImage(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("cover_image", coverImage);
    fd.set("blocks", JSON.stringify(blocks));
    const result = await upsertPost(fd);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    } else {
      router.push("/admin/blog");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <div className="bg-white border border-border-subtle rounded-2xl p-5 space-y-4">
        <Field label="Título" required>
          <input name="title" defaultValue={post?.title ?? ""} required className={fieldClass} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Slug (URL)">
            <input name="slug" defaultValue={post?.slug ?? ""} className={fieldClass} placeholder="meu-post" />
          </Field>
          <Field label="Autor">
            <input name="author" defaultValue={post?.author ?? "Your Guide Algarve"} className={fieldClass} />
          </Field>
        </div>
        <Field label="Resumo (excerpt)">
          <input name="excerpt" defaultValue={post?.excerpt ?? ""} className={fieldClass} placeholder="Uma frase curta que aparece nos cards" />
        </Field>

        <Field label="Imagem de capa" required>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className={fieldClass + " flex-1"}
                placeholder="https://... ou faça upload"
              />
              <button
                type="button"
                onClick={() => coverRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-subtle text-[12.5px] hover:bg-surface-alt disabled:opacity-60"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Upload
              </button>
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = ""; }} />
            {coverImage ? (
              <img src={coverImage} alt="" className="h-24 w-auto rounded-lg object-cover border border-border-subtle" />
            ) : null}
          </div>
        </Field>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_published" defaultChecked={post?.is_published ?? false} className="w-4 h-4 accent-navy-800" />
          <span className="text-[13px] text-text-strong">Publicar agora</span>
        </label>
      </div>

      <div className="bg-white border border-border-subtle rounded-2xl p-5">
        <h2 className="text-[14px] font-bold text-text-strong mb-3">Conteúdo da postagem</h2>
        <BlockEditor value={blocks} onChange={setBlocks} />
      </div>

      {error ? (
        <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-5 py-2.5 rounded-lg text-[14px] flex items-center gap-2 disabled:opacity-60"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {post ? "Salvar alterações" : "Cadastrar postagem"}
        </button>
        <Link href="/admin/blog" className="text-[13.5px] text-text-muted hover:text-text-strong">Cancelar</Link>
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
