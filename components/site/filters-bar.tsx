import Link from "next/link";
import { Map, MapPin } from "lucide-react";
import type { Destination } from "@/lib/types";

type Modo = "destinos" | "atividades" | "experiencias";

export function FiltersBar({
  destinations,
  currentModo,
  currentDestination,
}: {
  destinations: Destination[];
  currentModo?: Modo;
  currentDestination?: string;
}) {
  const tabs: { modo: Modo; label: string }[] = [
    { modo: "destinos", label: "Destinos" },
    { modo: "atividades", label: "Atividades" },
    { modo: "experiencias", label: "Experiências" },
  ];

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
      {tabs.map(({ modo, label }) => (
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
          {label}
        </Link>
      ))}

      <span className="w-px h-5 bg-border-subtle mx-1 shrink-0" />

      <a
        href="https://maps.google.com/?q=Algarve,Portugal"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border-subtle text-[13px] font-semibold text-text-strong hover:bg-surface-alt shrink-0"
      >
        <Map className="w-3.5 h-3.5" /> Mapa
      </a>
    </div>
  );
}
