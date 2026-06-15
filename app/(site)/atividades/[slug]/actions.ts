"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export type ReviewFormState = {
  error?: string;
  success?: boolean;
};

export async function submitReview(
  _prev: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const locale = await getLocale();
  const tourId     = formData.get("tour_id") as string;
  const authorName = (formData.get("author_name") as string)?.trim();
  const ratingRaw  = formData.get("rating") as string;
  const body       = (formData.get("body") as string)?.trim();

  if (!tourId || !authorName || !ratingRaw || !body)
    return { error: t(locale, "review.error.fillAll") };

  const rating = parseInt(ratingRaw, 10);
  if (isNaN(rating) || rating < 1 || rating > 5)
    return { error: t(locale, "review.error.rating") };

  if (body.length < 10)
    return { error: t(locale, "review.error.minChars") };

  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("reviews")
    .insert({ tour_id: tourId, author_name: authorName, rating, body });

  if (error) return { error: t(locale, "review.error.save") };

  revalidatePath(`/atividades`);
  return { success: true };
}
