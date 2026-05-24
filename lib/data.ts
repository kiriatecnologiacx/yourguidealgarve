import { createSupabaseServer } from "@/lib/supabase/server";
import type { Category, Destination, Review, Tour, TourWithRelations } from "@/lib/types";

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

export const ACTIVITY_SLUGS = ["aventura-natureza", "passeios-de-barco", "praias-relaxamento", "transfers"];
export const EXPERIENCE_SLUGS = ["cultura-historia", "gastronomia"];

// UUIDs from DB — used for server-side SQL filtering (more reliable than join-based client filter)
const ACTIVITY_CATEGORY_IDS = [
  "5463bdd0-1854-4cec-8e14-95436ced43ce", // aventura-natureza
  "7699bde0-70dc-4866-b45a-2458a3fe7bdf", // passeios-de-barco
  "964c978d-6b26-406b-a3c7-603a0933ba63", // praias-relaxamento
  "d251e360-10c0-45da-83b9-dfcd315c4fe6", // transfers
];
const EXPERIENCE_CATEGORY_IDS = [
  "292aa9e0-0187-4994-bd09-6c2f53c1c5be", // cultura-historia
  "12033859-88ae-4a45-96cf-e6f7e1392bcd", // gastronomia
];

export async function listTours(filters: {
  category?: string;
  categoryGroup?: "atividades" | "experiencias";
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

  // Server-side category group filter (SQL level — avoids join issues)
  if (filters.categoryGroup === "atividades")
    query = query.in("category_id", ACTIVITY_CATEGORY_IDS);
  if (filters.categoryGroup === "experiencias")
    query = query.in("category_id", EXPERIENCE_CATEGORY_IDS);

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

export async function getReviewsByTourId(tourId: string): Promise<Review[]> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("tour_id", tourId)
    .eq("approved", true)
    .order("created_at", { ascending: false });
  return (data ?? []) as Review[];
}
