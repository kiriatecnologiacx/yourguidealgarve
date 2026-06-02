"use server";

import { cookies } from "next/headers";
import { LOCALES } from "@/lib/i18n";

export async function switchLocale(code: string) {
  if (!LOCALES.some((l) => l.code === code)) return { ok: false };
  const store = await cookies();
  store.set("yga_lang", code, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false,
  });
  return { ok: true };
}
