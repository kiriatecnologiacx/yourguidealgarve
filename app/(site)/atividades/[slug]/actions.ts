"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ReviewFormState = {
  error?: string;
  success?: boolean;
};

export async function submitReview(
  _prev: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const tourId = formData.get("tour_id") as string;
  const authorName = (formData.get("author_name") as string)?.trim();
  const ratingRaw = formData.get("rating") as string;
  const body = (formData.get("body") as string)?.trim();

  if (!tourId || !authorName || !ratingRaw || !body) {
    return { error: "Preencha todos os campos." };
  }
  const rating = parseInt(ratingRaw, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Selecione uma nota de 1 a 5." };
  }
  if (body.length < 10) {
    return { error: "Escreva pelo menos 10 caracteres na avaliação." };
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("reviews")
    .insert({ tour_id: tourId, author_name: authorName, rating, body });

  if (error) return { error: "Erro ao salvar avaliação. Tente novamente." };

  revalidatePath(`/atividades`);
  return { success: true };
}
