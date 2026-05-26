"use server";

import { translateText, translateLines, type TranslateLang } from "@/lib/translate";

export type TranslateResult = {
  ok: boolean;
  error?: string;
  title?: string;
  short_description?: string;
  description?: string;
  highlights?: string[];
};

export async function autoTranslateTour(
  lang: TranslateLang,
  title: string,
  shortDescription: string,
  description: string,
  highlights: string[],
): Promise<TranslateResult> {
  try {
    const [transTitle, transShort, transDesc, transHighlights] =
      await Promise.all([
        title ? translateText(title, lang) : Promise.resolve(""),
        shortDescription ? translateText(shortDescription, lang) : Promise.resolve(""),
        description ? translateText(description, lang) : Promise.resolve(""),
        highlights.length > 0 ? translateLines(highlights, lang) : Promise.resolve([]),
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
