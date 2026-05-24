"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertFaq(_prev: unknown, formData: FormData) {
  const supabase = await createSupabaseServer();
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const position = Number(formData.get("position") ?? 0);
  const is_published = formData.get("is_published") === "on";

  if (!question || !answer) return { error: "Pergunta e resposta são obrigatórias." };

  if (id) {
    await supabase.from("faqs").update({ question, answer, position, is_published }).eq("id", id);
  } else {
    await supabase.from("faqs").insert({ question, answer, position, is_published });
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
