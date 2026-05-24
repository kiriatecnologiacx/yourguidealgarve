import { createSupabaseServer } from "@/lib/supabase/server";
import { FaqManager } from "@/components/admin/faq-manager";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .order("position", { ascending: true });
  const faqs = data ?? [];

  return (
    <div className="px-6 lg:px-10 py-8 max-w-4xl">
      <h1 className="text-2xl font-extrabold text-text-strong">FAQ</h1>
      <p className="text-[13.5px] text-text-muted">
        Perguntas e respostas exibidas na página de FAQ do site.
      </p>
      <FaqManager faqs={faqs} />
    </div>
  );
}
