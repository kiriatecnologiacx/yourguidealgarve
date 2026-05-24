import Link from "next/link";
import type { Tour } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { TourCard } from "./tour-card";

export function FeaturedToursRail({
  tours,
  locale,
  isAuthed,
  favIds,
}: {
  tours: Tour[];
  locale: Locale;
  isAuthed: boolean;
  favIds: Set<string>;
}) {
  if (tours.length === 0) return null;

  return (
    <section className="bg-surface-alt">
      <div className="mx-auto max-w-[1240px] px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-text-strong">
              Passeios em Destaque
            </h2>
            <p className="text-[13.5px] text-text-muted mt-1">
              As experiências mais populares do Algarve
            </p>
          </div>
          <Link
            href="/atividades"
            className="text-[13.5px] font-semibold text-navy-700 hover:underline shrink-0"
          >
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {tours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              locale={locale}
              isAuthed={isAuthed}
              isFavorite={favIds.has(tour.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
