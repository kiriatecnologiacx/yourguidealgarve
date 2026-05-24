"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markRead(id: string) {
  const supabase = await createSupabaseServer();
  await supabase.from("contact_messages").update({ read: true }).eq("id", id);
  revalidatePath("/admin/contacto");
}
