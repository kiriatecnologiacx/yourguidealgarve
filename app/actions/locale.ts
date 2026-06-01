"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LOCALES } from "@/lib/i18n";

export async function switchLocale(code: string, returnPath: string) {
  if (!LOCALES.some((l) => l.code === code)) return;

  // Guarantee same-origin redirect: must start with "/" but not "//" or "/\"
  const safePath =
    typeof returnPath === "string" &&
    returnPath.startsWith("/") &&
    !returnPath.startsWith("//") &&
    !returnPath.startsWith("/\\")
      ? returnPath
      : "/";

  const store = await cookies();
  store.set("yga_lang", code, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false,
  });
  redirect(safePath);
}
