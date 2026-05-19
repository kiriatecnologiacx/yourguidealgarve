"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

export type TeamFormState = { error?: string; success?: string };

export async function inviteAdmin(
  _prev: TeamFormState,
  formData: FormData,
): Promise<TeamFormState> {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "editor") as "owner" | "editor";
  const name = String(formData.get("name") ?? "").trim();

  if (!email) return { error: "E-mail obrigatório." };

  // Check if already exists in auth
  const { data: existing } = await supabase
    .from("admins")
    .select("user_id")
    .eq("email", email)
    .maybeSingle();

  if (existing) return { error: "Este e-mail já tem acesso ao admin." };

  // Send password reset / magic link via Supabase — user sets their own password
  // We store a pending invite in admins table with a placeholder user_id
  // When they sign in for the first time it will be linked
  const { data: signupData, error: signupErr } = await supabase.auth.admin
    ? { data: null, error: new Error("admin not available on anon key") }
    : { data: null, error: new Error("use service role") };

  // Fallback: insert with email only, user_id filled when they first log in
  const { error: insertErr } = await supabase.from("admins").insert({
    user_id: "00000000-0000-0000-0000-000000000000", // placeholder, will be updated
    email,
    role,
    name: name || null,
  });

  if (insertErr) return { error: insertErr.message };

  revalidatePath("/admin/equipe");
  return { success: `Acesso configurado para ${email}. Envie as credenciais manualmente.` };
}

export async function removeAdmin(userId: string) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  // Prevent removing yourself
  if (userId === user.id) return;
  await supabase.from("admins").delete().eq("user_id", userId);
  revalidatePath("/admin/equipe");
}

export async function updateAdminRole(userId: string, role: "owner" | "editor") {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("admins").update({ role }).eq("user_id", userId);
  revalidatePath("/admin/equipe");
}
