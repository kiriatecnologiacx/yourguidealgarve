import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { PartnerForm } from "@/components/admin/partner-form";

export const dynamic = "force-dynamic";

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const { data } = await supabase.from("partners").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="px-6 lg:px-10 py-8 max-w-3xl">
      <h1 className="text-2xl font-extrabold text-text-strong mb-6">Editar parceiro</h1>
      <PartnerForm partner={data} />
    </div>
  );
}
