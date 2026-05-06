import { createSupabaseServer } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getFavoriteIds(): Promise<Set<string>> {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data } = await supabase
    .from("favorites")
    .select("tour_id")
    .eq("user_id", user.id);
  return new Set((data ?? []).map((r) => r.tour_id));
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  return !!data;
}
