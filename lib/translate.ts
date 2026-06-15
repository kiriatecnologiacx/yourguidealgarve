export type TranslateLang = "PT" | "FR" | "EN";

const MYMEMORY_LANG: Record<TranslateLang, string> = {
  PT: "pt-PT",
  FR: "fr",
  EN: "en",
};

export async function translateText(
  text: string,
  targetLang: TranslateLang,
): Promise<{ text: string; detectedLang: string }> {
  if (!text?.trim()) return { text: text ?? "", detectedLang: "EN" };

  const pair = `en|${MYMEMORY_LANG[targetLang]}`;
  const url  = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory ${res.status}`);

  const json = await res.json();
  if (json.responseStatus !== 200) {
    throw new Error(`MyMemory: ${json.responseDetails ?? json.responseStatus}`);
  }

  return { text: json.responseData.translatedText as string, detectedLang: "EN" };
}

export async function translateLines(
  lines: string[],
  targetLang: TranslateLang,
): Promise<string[]> {
  if (lines.length === 0) return [];
  // Traduzir cada linha separadamente para evitar problemas com separadores
  const results = await Promise.all(
    lines.map((l) => translateText(l, targetLang).then((r) => r.text).catch(() => l))
  );
  return results;
}

// Mantido para compatibilidade — MyMemory não tem detecção, assume EN
export async function detectLang(_text: string): Promise<TranslateLang | null> {
  return "EN";
}
