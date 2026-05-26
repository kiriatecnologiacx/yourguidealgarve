"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function subscribeNewsletter(
  _prev: { ok?: boolean; error?: string },
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Email inválido." };
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

  if (error) return { error: "Erro ao subscrever. Tente novamente." };
  return { ok: true };
}
