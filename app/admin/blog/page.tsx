import Link from "next/link";
import Image from "next/image";
import { Plus, Edit } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";
import { PostRowActions } from "@/components/admin/post-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminBlogIndex() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  const posts = data ?? [];

  return (
    <div className="px-6 lg:px-10 py-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-text-strong">Blog</h1>
          <p className="text-[13.5px] text-text-muted">
            {posts.length} postagem{posts.length === 1 ? "" : "s"} cadastrada
            {posts.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/blog/novo"
          className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-4 py-2.5 rounded-lg text-[13.5px] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nova postagem
        </Link>
      </div>

      <div className="mt-6 bg-white border border-border-subtle rounded-2xl overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[15px] font-semibold text-text-strong">
              Nenhuma postagem ainda
            </p>
            <Link
              href="/admin/blog/novo"
              className="mt-4 inline-flex bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-4 py-2.5 rounded-lg text-[13.5px] items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Adicionar postagem
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-surface-alt border-b border-border-subtle text-[12px] uppercase tracking-wide text-text-muted">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Postagem</th>
                <th className="text-left px-5 py-3 font-semibold">Autor</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-left px-5 py-3 font-semibold">Data</th>
                <th className="text-right px-5 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-surface-alt">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-alt">
                        {p.cover_image ? (
                          <Image src={p.cover_image} alt="" fill className="object-cover" sizes="48px" />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-text-strong line-clamp-1">
                          {p.title}
                        </p>
                        <p className="text-[12px] text-text-muted line-clamp-1">
                          /{p.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-text-strong">{p.author}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[11.5px] font-semibold px-2 py-1 rounded-full ${
                        p.is_published
                          ? "bg-success/10 text-success"
                          : "bg-text-muted/10 text-text-muted"
                      }`}
                    >
                      {p.is_published ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-text-muted">
                    {p.published_at
                      ? new Date(p.published_at).toLocaleDateString("pt-BR")
                      : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/blog/${p.id}`}
                        className="grid place-items-center w-8 h-8 rounded-md text-text-muted hover:text-text-strong hover:bg-surface-alt"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <PostRowActions id={p.id} isPublished={p.is_published} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
