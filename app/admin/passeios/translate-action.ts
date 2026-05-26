"use server";

import { translateText, translateLines, detectLang, type TranslateLang } from "@/lib/translate";

export type TranslateResult = {
  ok: boolean;
  error?: string;
  title?: string;
  short_description?: string;
  description?: string;
  highlights?: string[];
};

export async function autoTranslateTour(
  targetLang: TranslateLang,
  title: string,
  shortDescription: string,
  description: string,
  highlights: string[],
): Promise<TranslateResult> {
  try {
    // Detect source language so DeepL translates correctly regardless of what Rui wrote
    const sourceLang = await detectLang(title).catch(() => null);

    // If source and target are the same language, nothing to do
    if (sourceLang === targetLang) {
      return { ok: false, error: `O texto já está em ${targetLang === "PT" ? "Português" : "Français"}.` };
    }

    const [transTitle, transShort, transDesc, transHighlights] = await Promise.all([
      title ? translateText(title, targetLang).then((r) => r.text) : Promise.resolve(""),
      shortDescription ? translateText(shortDescription, targetLang).then((r) => r.text) : Promise.resolve(""),
      description ? translateText(description, targetLang).then((r) => r.text) : Promise.resolve(""),
      highlights.length > 0 ? translateLines(highlights, targetLang) : Promise.resolve([]),
    ]);

    return {
      ok: true,
      title: transTitle,
      short_description: transShort,
      description: transDesc,
      highlights: transHighlights,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erro ao traduzir.",
    };
  }
}
