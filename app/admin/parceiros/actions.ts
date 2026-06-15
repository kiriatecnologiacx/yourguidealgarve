"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export type PartnerFormState = { error?: string; success?: boolean };

export async function upsertPartner(
  _prev: PartnerFormState,
  formData: FormData,
): Promise<PartnerFormState> {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const id = formData.get("id") ? String(formData.get("id")) : null;
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Nome obrigatório." };

  const payload = {
    name,
    website:        String(formData.get("website") ?? "").trim() || null,
    contact_email:  String(formData.get("contact_email") ?? "").trim() || null,
    phone:          String(formData.get("phone") ?? "").trim() || null,
    instagram:      String(formData.get("instagram") ?? "").trim() || null,
    whatsapp:       String(formData.get("whatsapp") ?? "").trim() || null,
    rezdy_alias:    String(formData.get("rezdy_alias") ?? "").trim() || null,
    logo_url:       String(formData.get("logo_url") ?? "").trim() || null,
    description:    String(formData.get("description") ?? "").trim() || null,
    commission_pct: parseFloat(String(formData.get("commission_pct") ?? "")) || null,
    is_active:      formData.get("is_active") === "on",
    notes:          String(formData.get("notes") ?? "").trim() || null,
  };

  if (id) {
    await supabase.from("partners").update(payload).eq("id", id);
  } else {
    await supabase.from("partners").insert(payload);
  }

  revalidatePath("/admin/parceiros");
  redirect("/admin/parceiros");
}

export async function deletePartner(id: string) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("partners").delete().eq("id", id);
  revalidatePath("/admin/parceiros");
  redirect("/admin/parceiros");
}
