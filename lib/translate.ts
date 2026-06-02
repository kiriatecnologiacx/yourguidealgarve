export type TranslateLang = "PT" | "FR" | "EN";

// DeepL language codes for detection response
const LANG_MAP: Record<string, TranslateLang> = {
  PT: "PT",
  "PT-PT": "PT",
  "PT-BR": "PT",
  FR: "FR",
  EN: "EN",
  "EN-GB": "EN",
  "EN-US": "EN",
};

export async function translateText(
  text: string,
  targetLang: TranslateLang,
  sourceLang?: string,
): Promise<{ text: string; detectedLang: string }> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY não configurada.");

  // DEEPL_API_URL overrides auto-detection; free keys end in :fx
  const host = process.env.DEEPL_API_URL ?? (apiKey.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com");

  const body: Record<string, unknown> = {
    text: [text],
    target_lang: targetLang,
    preserve_formatting: true,
  };
  // Only set source_lang when explicitly provided
  if (sourceLang) body.source_lang = sourceLang;

  const res = await fetch(`https://${host}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepL error ${res.status}: ${err}`);
  }

  const json = await res.json();
  return {
    text: json.translations[0].text as string,
    detectedLang: (json.translations[0].detected_source_language as string ?? "").toUpperCase(),
  };
}

export async function translateLines(
  lines: string[],
  targetLang: TranslateLang,
  sourceLang?: string,
): Promise<string[]> {
  if (lines.length === 0) return [];
  const SEP = "\n||||\n";
  const joined = lines.join(SEP);
  const { text } = await translateText(joined, targetLang, sourceLang);
  return text.split(SEP).map((s) => s.trim());
}

/**
 * Detects the language of a text using DeepL.
 * Returns normalized lang code: "EN" | "PT" | "FR" | other
 */
export async function detectLang(text: string): Promise<TranslateLang | null> {
  try {
    // Translate to a dummy target just to get the detected language
    const { detectedLang } = await translateText(text, "EN");
    return LANG_MAP[detectedLang] ?? null;
  } catch {
    return null;
  }
}
