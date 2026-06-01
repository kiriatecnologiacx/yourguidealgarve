"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LOCALES } from "@/lib/i18n";

export async function switchLocale(code: string, returnPath: string) {
  if (!LOCALES.some((l) => l.code === code)) return;
  const store = await cookies();
  store.set("yga_lang", code, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false,
  });
  redirect(returnPath);
}
