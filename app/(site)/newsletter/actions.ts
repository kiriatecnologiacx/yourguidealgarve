"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export async function subscribeNewsletter(
  _prev: { ok?: boolean; error?: string },
  formData: FormData,
) {
  const locale = await getLocale();
  const email  = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: t(locale, "newsletter.error.email") };

  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

  if (error) return { error: t(locale, "newsletter.error.subscribe") };
  return { ok: true };
}
