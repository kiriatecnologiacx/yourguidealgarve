import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const c = (await cookies()).get("yga_lang")?.value;
  if (c && LOCALES.some((l) => l.code === c)) return c as Locale;
  return DEFAULT_LOCALE;
}
