"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { translateText } from "@/lib/translate";

export async function upsertFaq(_prev: unknown, formData: FormData) {
  const supabase = await createSupabaseServer();
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const position = Number(formData.get("position") ?? 0);
  const is_published = formData.get("is_published") === "on";

  if (!question || !answer) return { error: "Pergunta e resposta são obrigatórias." };

  const payload: Record<string, unknown> = { question, answer, position, is_published };

  if (process.env.DEEPL_API_KEY) {
    try {
      const [qPt, qFr, aPt, aFr] = await Promise.all([
        translateText(question, "PT").then((r) => r.text).catch(() => null),
        translateText(question, "FR").then((r) => r.text).catch(() => null),
        translateText(answer,   "PT").then((r) => r.text).catch(() => null),
        translateText(answer,   "FR").then((r) => r.text).catch(() => null),
      ]);
      if (qPt) payload.question_pt = qPt;
      if (qFr) payload.question_fr = qFr;
      if (aPt) payload.answer_pt   = aPt;
      if (aFr) payload.answer_fr   = aFr;
    } catch {
      // non-fatal
    }
  }

  if (id) {
    await supabase.from("faqs").update(payload).eq("id", id);
  } else {
    await supabase.from("faqs").insert(payload);
  }

  revalidatePath("/admin/faq");
  revalidatePath("/faq");
  return { ok: true };
}

export async function deleteFaq(id: string) {
  const supabase = await createSupabaseServer();
  await supabase.from("faqs").delete().eq("id", id);
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}
