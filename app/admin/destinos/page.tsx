import { createSupabaseServer } from "@/lib/supabase/server";
import { DestinationManager } from "@/components/admin/destination-manager";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("destinations")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });
  const destinations = data ?? [];

  return (
    <div className="px-6 lg:px-10 py-8 max-w-4xl">
      <h1 className="text-2xl font-extrabold text-text-strong">Destinos</h1>
      <p className="text-[13.5px] text-text-muted">
        Cidades e regiões do Algarve exibidas no site (Lagos, Faro, etc).
      </p>
      <DestinationManager destinations={destinations} />
    </div>
  );
}
