"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");
  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!data) throw new Error("Não autorizado");
  return user;
}

export type AppUser = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
};

export async function listUsers(): Promise<AppUser[]> {
  await requireAdmin();
  const supabaseAdmin = createSupabaseAdmin();
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;
  return (data.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "",
    full_name: (u.user_metadata?.full_name as string | undefined) ?? null,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
  }));
}

export async function sendPasswordResetToUser(email: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://youguidealgarve.vercel.app";
    const res = await fetch(`${siteUrl}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, redirectTo: `${siteUrl}/nova-senha` }),
    });
    if (!res.ok) return { ok: false, error: "Erro ao enviar e-mail" };
    return { ok: true };
  } catch {
    return { ok: false, error: "Erro ao enviar e-mail" };
  }
}
