import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { tourId, action } = (await req.json()) as { tourId: string; action: "add" | "remove" };
  if (!tourId) return NextResponse.json({ error: "missing tourId" }, { status: 400 });

  if (action === "remove") {
    await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("tour_id", tourId);
  } else {
    await supabase
      .from("favorites")
      .upsert({ user_id: user.id, tour_id: tourId }, { onConflict: "user_id,tour_id" });
  }

  return NextResponse.json({ ok: true });
}
