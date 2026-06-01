import Link from "next/link";
import { Map, MapPin, X } from "lucide-react";
import type { Destination } from "@/lib/types";
import { t, type Locale } from "@/lib/i18n";

type Modo = "destinos" | "atividades" | "experiencias";

export function FiltersBar({
  destinations,
  currentModo,
  currentDestination,
  currentCategoria,
  categoryName,
  locale,
}: {
  destinations: Destination[];
  currentModo?: Modo;
  currentDestination?: string;
  currentCategoria?: string;
  categoryName?: string;
  locale: Locale;
}) {
  const tabs: { modo: Modo; key: string }[] = [
    { modo: "destinos",    key: "filter.destinations" },
    { modo: "atividades",  key: "filter.activities" },
    { modo: "experiencias",key: "filter.experiences" },
  ];

  const clearCategoriaHref = currentDestination
    ? `/atividades?destino=${currentDestination}`
    : "/atividades";

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
      {tabs.map(({ modo, key }) => (
        <Link
          key={modo}
          href={`/atividades?modo=${modo}`}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] font-semibold shrink-0 transition-colors ${
            currentModo === modo
              ? "bg-navy-800 border-navy-800 text-white"
              : "border-border-subtle text-text-strong hover:bg-surface-alt"
          }`}
        >
          {modo === "destinos" && <MapPin className="w-3.5 h-3.5" />}
          {t(locale, key)}
        </Link>
      ))}

      {currentCategoria && categoryName && (
        <Link
          href={clearCategoriaHref}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border bg-brand-yellow border-brand-yellow text-navy-900 text-[13px] font-semibold shrink-0 hover:bg-brand-yellow-hover transition-colors"
        >
          {categoryName}
          <X className="w-3.5 h-3.5" />
        </Link>
      )}

      <span className="w-px h-5 bg-border-subtle mx-1 shrink-0" />

      <a
        href="https://maps.google.com/?q=Algarve,Portugal"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border-subtle text-[13px] font-semibold text-text-strong hover:bg-surface-alt shrink-0"
      >
        <Map className="w-3.5 h-3.5" /> {t(locale, "filter.map")}
      </a>
    </div>
  );
}
