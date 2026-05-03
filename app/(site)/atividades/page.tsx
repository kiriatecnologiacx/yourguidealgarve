import Link from "next/link";
import { TourCard } from "@/components/site/tour-card";
import { listCategories, listDestinations, listTours } from "@/lib/data";
import { Filter, Map } from "lucide-react";

export const revalidate = 60;

export default async function AtividadesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const destino = typeof sp.destino === "string" ? sp.destino : undefined;
  const categoria = typeof sp.categoria === "string" ? sp.categoria : undefined;

  const [tours, categories, destinations] = await Promise.all([
    listTours({ q, destination: destino, category: categoria }),
    listCategories(),
    listDestinations(false),
  ]);

  const destinationName = destinations.find((d) => d.slug === destino)?.name;
  const categoryName = categories.find((c) => c.slug === categoria)?.name;
  const headingParts = [
    destinationName ?? "Atividades no Algarve",
    categoryName,
    q ? `“${q}”` : null,
  ].filter(Boolean);

  return (
    <>
      <section className="bg-navy-800 text-white">
        <div className="mx-auto max-w-[1240px] px-5 py-10">
          <p className="text-[12.5px] text-white/70">
            <Link href="/" className="hover:text-white">Início</Link>{" "}
            <span className="mx-1">›</span> Atividades
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">
            {headingParts[0]}
          </h1>
          <p className="mt-1 text-white/80 text-[14px]">
            {tours.length} atividades disponíveis
            {categoryName ? ` — ${categoryName}` : ""}
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-border-subtle">
        <div className="mx-auto max-w-[1240px] px-5 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-subtle text-[13px] font-medium text-text-strong hover:bg-surface-alt">
            <Filter className="w-3.5 h-3.5" /> Filtros
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-subtle text-[13px] font-medium text-text-strong hover:bg-surface-alt">
            <Map className="w-3.5 h-3.5" /> Mapa
          </button>
          <span className="w-px h-5 bg-border-subtle mx-1" />
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/atividades?categoria=${cat.slug}`}
              className={`px-3 py-1.5 rounded-full border text-[13px] font-medium whitespace-nowrap ${
                cat.slug === categoria
                  ? "bg-navy-800 border-navy-800 text-white"
                  : "border-border-subtle text-text-strong hover:bg-surface-alt"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface-alt">
        <div className="mx-auto max-w-[1240px] px-5 py-8">
          {tours.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border-subtle p-10 text-center">
              <p className="text-[15px] font-semibold text-text-strong">
                Nenhuma atividade encontrada
              </p>
              <p className="text-[13.5px] text-text-muted mt-1">
                Tente ajustar os filtros ou voltar para a página inicial.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
