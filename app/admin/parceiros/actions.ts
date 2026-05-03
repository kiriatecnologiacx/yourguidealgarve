"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function upsertPartner(formData: FormData) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const id = formData.get("id") ? String(formData.get("id")) : null;
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    website: String(formData.get("website") ?? "") || null,
    contact_email: String(formData.get("contact_email") ?? "") || null,
    notes: String(formData.get("notes") ?? "") || null,
  };
  if (!payload.name) return;

  if (id) await supabase.from("partners").update(payload).eq("id", id);
  else await supabase.from("partners").insert(payload);

  revalidatePath("/admin/parceiros");
}

export async function deletePartner(id: string) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("partners").delete().eq("id", id);
  revalidatePath("/admin/parceiros");
}
