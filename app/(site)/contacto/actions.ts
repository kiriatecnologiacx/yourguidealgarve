"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export async function submitContact(_prev: unknown, formData: FormData) {
  const locale  = await getLocale();
  const name    = String(formData.get("name")    ?? "").trim();
  const email   = String(formData.get("email")   ?? "").trim();
  const phone   = String(formData.get("phone")   ?? "").trim() || null;
  const subject = String(formData.get("subject") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message)
    return { error: t(locale, "contact.error.fillAll") };

  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, email, phone, subject, message });

  if (error) return { error: t(locale, "contact.error.send") };
  return { ok: true };
}
