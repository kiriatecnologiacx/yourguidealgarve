import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ tours: [], destinations: [] });
  }

  const supabase = await createSupabaseServer();

  const [toursRes, destRes] = await Promise.all([
    supabase
      .from("tours")
      .select("id, slug, title, cover_image, price_from_brl, price_brl")
      .eq("is_published", true)
      .ilike("title", `%${q}%`)
      .limit(6),
    supabase
      .from("destinations")
      .select("id, slug, name, image, activities_count")
      .ilike("name", `%${q}%`)
      .limit(4),
  ]);

  return NextResponse.json({
    tours: toursRes.data ?? [],
    destinations: destRes.data ?? [],
  });
}
