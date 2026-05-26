export type TranslateLang = "PT" | "FR";

export async function translateText(
  text: string,
  targetLang: TranslateLang,
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error("DEEPL_API_KEY não configurada.");

  // DeepL free keys end with ":fx", paid keys use api.deepl.com
  const host = apiKey.endsWith(":fx")
    ? "api-free.deepl.com"
    : "api.deepl.com";

  const res = await fetch(`https://${host}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: [text],
      target_lang: targetLang,
      source_lang: "EN",
      preserve_formatting: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DeepL error ${res.status}: ${body}`);
  }

  const json = await res.json();
  return json.translations[0].text as string;
}

export async function translateLines(
  lines: string[],
  targetLang: TranslateLang,
): Promise<string[]> {
  if (lines.length === 0) return [];
  // Join with separator, translate once (cheaper), split back
  const SEP = "\n||||\n";
  const joined = lines.join(SEP);
  const translated = await translateText(joined, targetLang);
  return translated.split(SEP).map((s) => s.trim());
}
