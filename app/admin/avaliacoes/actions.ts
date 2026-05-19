"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveReview(id: string) {
  const supabase = await createSupabaseServer();
  await supabase.from("reviews").update({ approved: true }).eq("id", id);
  revalidatePath("/admin/avaliacoes");
}

export async function deleteReview(id: string) {
  const supabase = await createSupabaseServer();
  await supabase.from("reviews").delete().eq("id", id);
  revalidatePath("/admin/avaliacoes");
}
