"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { upsertPost, type BlogFormState } from "@/app/admin/blog/actions";
import type { BlogPost } from "@/lib/blog";

const initial: BlogFormState = {};

const fieldClass =
  "w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 bg-white";

export function PostForm({ post }: { post?: BlogPost | null }) {
  const [state, action, pending] = useActionState(upsertPost, initial);

  return (
    <form action={action} className="space-y-5">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <div className="bg-white border border-border-subtle rounded-2xl p-5 space-y-4">
        <Field label="Título" required>
          <input
            name="title"
            defaultValue={post?.title ?? ""}
            required
            className={fieldClass}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Slug (URL)">
            <input
              name="slug"
              defaultValue={post?.slug ?? ""}
              className={fieldClass}
              placeholder="meu-post"
            />
          </Field>
          <Field label="Autor">
            <input
              name="author"
              defaultValue={post?.author ?? "YouGuideAlgarve"}
              className={fieldClass}
            />
          </Field>
        </div>
        <Field label="Resumo (excerpt)">
          <input
            name="excerpt"
            defaultValue={post?.excerpt ?? ""}
            className={fieldClass}
            placeholder="Uma frase curta que aparece nos cards"
          />
        </Field>
        <Field label="Imagem de capa (URL)" required>
          <input
            name="cover_image"
            defaultValue={post?.cover_image ?? ""}
            required
            className={fieldClass}
            placeholder="https://..."
          />
        </Field>
        <Field label="Conteúdo" required>
          <textarea
            name="content"
            defaultValue={post?.content ?? ""}
            required
            rows={14}
            className={fieldClass + " font-mono text-[13.5px] leading-relaxed"}
            placeholder={`Texto livre. Use linha em branco para parágrafos.\n\n## Subtítulo\nTexto comum. Use **negrito** quando precisar.`}
          />
        </Field>
        <p className="text-[11.5px] text-text-muted -mt-2">
          Dica: <code>## Título</code> vira subtítulo grande, <code>### Título</code> subtítulo menor, <code>**texto**</code> fica em negrito.
        </p>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={post?.is_published ?? false}
            className="w-4 h-4 accent-navy-800"
          />
          <span className="text-[13px] text-text-strong">Publicar agora</span>
        </label>
      </div>

      {state.error ? (
        <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-5 py-2.5 rounded-lg text-[14px] flex items-center gap-2 disabled:opacity-60"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {post ? "Salvar alterações" : "Cadastrar postagem"}
        </button>
        <Link
          href="/admin/blog"
          className="text-[13.5px] text-text-muted hover:text-text-strong"
        >
          Cancelar
        </Link>
      </div>
    </form>
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
