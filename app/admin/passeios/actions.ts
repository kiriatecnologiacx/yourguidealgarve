"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type TourFormState = { error?: string; ok?: boolean };

function parseList(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseGallery(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function requireAdmin() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");
  return { supabase, user };
}

export async function upsertTour(_prev: TourFormState, formData: FormData): Promise<TourFormState> {
  try {
    const { supabase } = await requireAdmin();
    const id = formData.get("id") ? String(formData.get("id")) : null;
    const title = String(formData.get("title") ?? "").trim();
    if (!title) return { error: "Título obrigatório" };

    const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
    const payload = {
      title,
      slug,
      short_description: String(formData.get("short_description") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
      cover_image: String(formData.get("cover_image") ?? "").trim(),
      gallery: parseGallery(formData.get("gallery")),
      price_brl: Number(formData.get("price_brl") ?? 0),
      price_from_brl: formData.get("price_from_brl")
        ? Number(formData.get("price_from_brl"))
        : null,
      duration: String(formData.get("duration") ?? "") || null,
      rating: formData.get("rating") ? Number(formData.get("rating")) : null,
      reviews_count: Number(formData.get("reviews_count") ?? 0),
      destination_id: formData.get("destination_id")
        ? String(formData.get("destination_id"))
        : null,
      category_id: formData.get("category_id")
        ? String(formData.get("category_id"))
        : null,
      partner_id: formData.get("partner_id")
        ? String(formData.get("partner_id"))
        : null,
      affiliate_url: String(formData.get("affiliate_url") ?? "").trim(),
      meeting_point: String(formData.get("meeting_point") ?? "") || null,
      included: parseList(formData.get("included")),
      highlights: parseList(formData.get("highlights")),
      free_cancellation: formData.get("free_cancellation") === "on",
      is_featured: formData.get("is_featured") === "on",
      is_published: formData.get("is_published") === "on",
      badge: String(formData.get("badge") ?? "") || null,
    };

    if (!payload.cover_image) return { error: "Imagem de capa obrigatória (URL)" };
    if (!payload.affiliate_url) return { error: "Link de afiliado obrigatório" };

    if (id) {
      const { error } = await supabase.from("tours").update(payload).eq("id", id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("tours").insert(payload);
      if (error) return { error: error.message };
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro inesperado" };
  }

  revalidatePath("/admin/passeios");
  revalidatePath("/");
  revalidatePath("/atividades");
  redirect("/admin/passeios");
}

export async function deleteTour(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("tours").delete().eq("id", id);
  revalidatePath("/admin/passeios");
  revalidatePath("/");
  revalidatePath("/atividades");
}

export async function togglePublish(id: string, next: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("tours").update({ is_published: next }).eq("id", id);
  revalidatePath("/admin/passeios");
  revalidatePath("/");
  revalidatePath("/atividades");
}
