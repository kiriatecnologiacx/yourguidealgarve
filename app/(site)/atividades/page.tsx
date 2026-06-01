import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { TourCard } from "@/components/site/tour-card";
import { FiltersBar } from "@/components/site/filters-bar";
import { listCategories, listDestinations, listTours } from "@/lib/data";
import { getCurrentUser, getFavoriteIds } from "@/lib/auth";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type Modo = "destinos" | "atividades" | "experiencias";

export default async function AtividadesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const destino = typeof sp.destino === "string" ? sp.destino : undefined;
  const modo = (typeof sp.modo === "string" ? sp.modo : undefined) as Modo | undefined;
  const categoria = typeof sp.categoria === "string" ? sp.categoria : undefined;

  const categoryGroup =
    modo === "atividades" ? "atividades" : modo === "experiencias" ? "experiencias" : undefined;

  const [tours, destinations, categories, user, favIds, locale] = await Promise.all([
    modo !== "destinos"
      ? listTours({ q, destination: destino, categoryGroup, category: categoria })
      : Promise.resolve([]),
    listDestinations(false),
    listCategories(),
    getCurrentUser(),
    getFavoriteIds(),
    getLocale(),
  ]);

  const isAuthed = !!user;
  const destinationName = destinations.find((d) => d.slug === destino)?.name;
  const categoryName = categoria ? (categories.find((c) => c.slug === categoria)?.name) : undefined;

  const inWord = t(locale, "common.in");
  const heading =
    modo === "destinos"
      ? t(locale, "page.activities.destinations")
      : modo === "atividades"
        ? destinationName
          ? `${t(locale, "page.activities.allActivities")} ${inWord} ${destinationName}`
          : t(locale, "page.activities.allActivitiesAlgarve")
        : modo === "experiencias"
          ? destinationName
            ? `${t(locale, "page.activities.allExperiences")} ${inWord} ${destinationName}`
            : t(locale, "page.activities.allExperiencesAlgarve")
          : categoryName
            ? destinationName ? `${categoryName} ${inWord} ${destinationName}` : categoryName
            : destinationName ?? t(locale, "page.activities.all");

  const subheading =
    modo === "destinos"
      ? `${destinations.length} ${t(locale, "page.activities.countDestinations")}`
      : modo === "experiencias"
        ? `${tours.length} ${t(locale, "page.activities.countExperiences")}`
        : `${tours.length} ${t(locale, "page.activities.countActivities")}`;

  return (
    <>
      <section className="bg-navy-800 text-white">
        <div className="mx-auto max-w-[1240px] px-5 py-10">
          <p className="text-[12.5px] text-white/70">
            <Link href="/" className="hover:text-white">{t(locale, "common.home")}</Link>{" "}
            <span className="mx-1">›</span> {t(locale, "page.activities.breadcrumb")}
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">{heading}</h1>
          <p className="mt-1 text-white/80 text-[14px]">{subheading}</p>
        </div>
      </section>

      <section className="bg-white border-b border-border-subtle">
        <FiltersBar
          destinations={destinations}
          currentModo={modo}
          currentDestination={destino}
          currentCategoria={categoria}
          categoryName={categoryName}
          locale={locale}
        />
      </section>

      <section className="bg-surface-alt">
        <div className="mx-auto max-w-[1240px] px-5 py-8">

          {/* DESTINOS MODE — show destination cards */}
          {modo === "destinos" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {destinations.map((d) => (
                <Link
                  key={d.id}
                  href={`/atividades?modo=atividades&destino=${d.slug}`}
                  className="group relative h-[200px] rounded-2xl overflow-hidden ring-1 ring-white/20 hover:ring-brand-yellow hover:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.35)] transition"
                >
                  {d.image ? (
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 280px"
                      unoptimized={!d.image.startsWith("/")}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-navy-200" />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(10,37,64,0.85) 100%)" }}
                  />
                  <div className="absolute left-4 bottom-4 right-4">
                    <p className="font-display text-white text-[18px] font-extrabold leading-tight drop-shadow">
                      {d.name}
                    </p>
                    <p className="text-white/85 text-[12px] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {d.activities_count} {t(locale, "tour.activities")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* ATIVIDADES / EXPERIÊNCIAS / ALL MODE — show tour cards */
            <>
              {/* Destination sub-filter chips when in atividades/experiencias mode */}
              {(modo === "atividades" || modo === "experiencias") && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <Link
                    href={`/atividades?modo=${modo}`}
                    className={`px-3 py-1.5 rounded-full border text-[13px] font-medium transition-colors ${
                      !destino
                        ? "bg-navy-800 border-navy-800 text-white"
                        : "border-border-subtle text-text-strong hover:bg-white bg-white"
                    }`}
                  >
                    Todos os destinos
                  </Link>
                  {destinations.map((d) => (
                    <Link
                      key={d.id}
                      href={`/atividades?modo=${modo}&destino=${d.slug}`}
                      className={`px-3 py-1.5 rounded-full border text-[13px] font-medium transition-colors ${
                        d.slug === destino
                          ? "bg-navy-800 border-navy-800 text-white"
                          : "border-border-subtle text-text-strong hover:bg-white bg-white"
                      }`}
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              )}

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
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      locale={locale}
                      isAuthed={isAuthed}
                      isFavorite={favIds.has(tour.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
