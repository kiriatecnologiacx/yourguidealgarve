"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function upsertCategory(formData: FormData) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const id = formData.get("id") ? String(formData.get("id")) : null;
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const payload = {
    name,
    slug: String(formData.get("slug") ?? "").trim() || slugify(name),
    image: String(formData.get("image") ?? "").trim(),
    icon: String(formData.get("icon") ?? "") || null,
    position: Number(formData.get("position") ?? 0),
  };
  if (!payload.image) return;

  if (id) await supabase.from("categories").update(payload).eq("id", id);
  else await supabase.from("categories").insert(payload);

  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}
