"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { Block } from "@/lib/blog-blocks";

async function requireAdmin() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");
  return { supabase, user };
}

export type BlogFormState = { error?: string; ok?: boolean } | undefined;

export async function upsertPost(formData: FormData): Promise<BlogFormState> {
  try {
    const { supabase } = await requireAdmin();
    const id = formData.get("id") ? String(formData.get("id")) : null;
    const title = String(formData.get("title") ?? "").trim();
    const blocksRaw = String(formData.get("blocks") ?? "[]");

    if (!title) return { error: "Título obrigatório" };

    let blocks: Block[];
    try {
      blocks = JSON.parse(blocksRaw);
    } catch {
      return { error: "Conteúdo inválido" };
    }

    const isPublished = formData.get("is_published") === "on";
    const payload = {
      title,
      slug: String(formData.get("slug") ?? "").trim() || slugify(title),
      excerpt: String(formData.get("excerpt") ?? "") || null,
      content: blocks,
      cover_image: String(formData.get("cover_image") ?? "").trim(),
      author: String(formData.get("author") ?? "") || "Your Guide Algarve",
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    };
    if (!payload.cover_image) return { error: "Imagem de capa obrigatória" };

    if (id) {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) return { error: error.message };
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro inesperado" };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function togglePostPublish(id: string, next: boolean) {
  const { supabase } = await requireAdmin();
  await supabase
    .from("blog_posts")
    .update({ is_published: next, published_at: next ? new Date().toISOString() : null })
    .eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
