import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const supabase = await createSupabaseServer();
  const locale = await getLocale();

  const { data: faqs } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });

  const items = faqs ?? [];

  return (
    <>
      <section className="bg-navy-800 text-white">
        <div className="mx-auto max-w-[1240px] px-5 py-10">
          <p className="text-[12.5px] text-white/70">
            <Link href="/" className="hover:text-white">Início</Link>{" "}
            <span className="mx-1">›</span> FAQ
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">Perguntas Frequentes</h1>
          <p className="mt-1 text-white/80 text-[14px]">Respostas às dúvidas mais comuns</p>
        </div>
      </section>

      <section className="bg-surface-alt">
        <div className="mx-auto max-w-[860px] px-5 py-12">
          {items.length === 0 ? (
            <p className="text-[14px] text-text-muted text-center py-12">
              Em breve aqui encontrará as perguntas mais frequentes.
            </p>
          ) : (
            <div className="space-y-4">
              {items.map((faq: any) => (
                <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-white rounded-2xl border border-border-subtle overflow-hidden">
      <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none text-[15px] font-semibold text-text-strong hover:bg-surface-alt">
        {question}
        <span className="ml-4 shrink-0 text-navy-700 group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <div className="px-6 pb-5 text-[14px] text-text-strong/85 leading-relaxed whitespace-pre-line border-t border-border-subtle pt-4">
        {answer}
      </div>
    </details>
  );
}
