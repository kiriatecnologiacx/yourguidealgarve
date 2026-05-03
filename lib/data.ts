import { createSupabaseServer } from "@/lib/supabase/server";
import type { Category, Destination, Tour, TourWithRelations } from "@/lib/types";

export async function getFeaturedTours(limit = 8): Promise<Tour[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("tours")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Tour[];
}

export async function listTours(filters: {
  category?: string;
  destination?: string;
  q?: string;
  limit?: number;
} = {}): Promise<Tour[]> {
  const supabase = await createSupabaseServer();
  let query = supabase
    .from("tours")
    .select("*, destination:destinations(slug,name), category:categories(slug,name)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (filters.q) query = query.ilike("title", `%${filters.q}%`);
  if (filters.limit) query = query.limit(filters.limit);

  const { data } = await query;
  let rows = (data ?? []) as unknown as TourWithRelations[];

  if (filters.destination)
    rows = rows.filter((t) => t.destination?.slug === filters.destination);
  if (filters.category)
    rows = rows.filter((t) => t.category?.slug === filters.category);

  return rows as Tour[];
}

export async function getTourBySlug(slug: string): Promise<TourWithRelations | null> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("tours")
    .select(
      "*, destination:destinations(*), category:categories(*), partner:partners(*)",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (data as TourWithRelations | null) ?? null;
}

export async function listCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("position", { ascending: true });
  return (data ?? []) as Category[];
}

export async function listDestinations(featuredOnly = true): Promise<Destination[]> {
  const supabase = await createSupabaseServer();
  let query = supabase.from("destinations").select("*").order("name");
  if (featuredOnly) query = query.eq("is_featured", true);
  const { data } = await query;
  return (data ?? []) as Destination[];
}
