"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { translateText } from "@/lib/translate";
import { translateBlocks } from "@/lib/translate-blocks";
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
    const excerpt = String(formData.get("excerpt") ?? "") || null;

    const payload: Record<string, unknown> = {
      title,
      slug: String(formData.get("slug") ?? "").trim() || slugify(title),
      excerpt,
      content: blocks,
      cover_image: String(formData.get("cover_image") ?? "").trim(),
      author: String(formData.get("author") ?? "") || "Your Guide Algarve",
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    };
    if (!payload.cover_image) return { error: "Imagem de capa obrigatória" };

    // Auto-translate with DeepL if key is configured
    if (process.env.DEEPL_API_KEY && title) {
      try {
        const [
          titlePt, titleFr,
          excerptPt, excerptFr,
          blocksPt, blocksFr,
        ] = await Promise.all([
          translateText(title, "PT").then((r) => r.text).catch(() => null),
          translateText(title, "FR").then((r) => r.text).catch(() => null),
          excerpt ? translateText(excerpt, "PT").then((r) => r.text).catch(() => null) : Promise.resolve(null),
          excerpt ? translateText(excerpt, "FR").then((r) => r.text).catch(() => null) : Promise.resolve(null),
          blocks.length ? translateBlocks(blocks, "PT").catch(() => null) : Promise.resolve(null),
          blocks.length ? translateBlocks(blocks, "FR").catch(() => null) : Promise.resolve(null),
        ]);
        if (titlePt)   payload.title_pt   = titlePt;
        if (titleFr)   payload.title_fr   = titleFr;
        if (excerptPt) payload.excerpt_pt = excerptPt;
        if (excerptFr) payload.excerpt_fr = excerptFr;
        if (blocksPt)  payload.content_pt = blocksPt;
        if (blocksFr)  payload.content_fr = blocksFr;
      } catch {
        // translation failure is non-fatal
      }
    }

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
