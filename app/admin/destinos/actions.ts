"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function upsertDestination(formData: FormData) {
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
    activities_count: Number(formData.get("activities_count") ?? 0),
    is_featured: formData.get("is_featured") === "on",
  };
  if (!payload.image) return;

  if (id) await supabase.from("destinations").update(payload).eq("id", id);
  else await supabase.from("destinations").insert(payload);

  revalidatePath("/admin/destinos");
  revalidatePath("/");
  revalidatePath("/atividades");
}

export async function deleteDestination(id: string) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("destinations").delete().eq("id", id);
  revalidatePath("/admin/destinos");
  revalidatePath("/");
}
