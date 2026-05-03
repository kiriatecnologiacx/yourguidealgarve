import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { TourForm } from "@/components/admin/tour-form";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminEditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const [tourQuery, categories, destinations, partners] = await Promise.all([
    supabase.from("tours").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("position"),
    supabase.from("destinations").select("*").order("name"),
    supabase.from("partners").select("*").order("name"),
  ]);

  if (!tourQuery.data) notFound();

  return (
    <div className="px-6 lg:px-10 py-8 max-w-4xl">
      <Link
        href="/admin/passeios"
        className="inline-flex items-center gap-1 text-[13px] text-text-muted hover:text-text-strong"
      >
        <ChevronLeft className="w-4 h-4" /> Voltar
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold text-text-strong">
        Editar passeio
      </h1>
      <p className="text-[13.5px] text-text-muted">{tourQuery.data.title}</p>

      <div className="mt-6">
        <TourForm
          tour={tourQuery.data}
          categories={categories.data ?? []}
          destinations={destinations.data ?? []}
          partners={partners.data ?? []}
        />
      </div>
    </div>
  );
}
