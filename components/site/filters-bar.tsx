"use client";

import { useState } from "react";
import Link from "next/link";
import { Map, MapPin, ChevronDown } from "lucide-react";
import type { Category, Destination } from "@/lib/types";

// Categories split by nature
const ACTIVITY_SLUGS = ["aventura-natureza", "passeios-de-barco", "praias-relaxamento", "transfers"];
const EXPERIENCE_SLUGS = ["cultura-historia", "gastronomia"];

type Tab = "destinos" | "atividades" | "experiencias";

export function FiltersBar({
  categories,
  destinations,
  currentCategory,
  currentDestination,
}: {
  categories: Category[];
  destinations: Destination[];
  currentCategory?: string;
  currentDestination?: string;
}) {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);

  const activityCategories = categories.filter((c) => ACTIVITY_SLUGS.includes(c.slug));
  const experienceCategories = categories.filter((c) => EXPERIENCE_SLUGS.includes(c.slug));

  function toggle(tab: Tab) {
    setActiveTab((prev) => (prev === tab ? null : tab));
  }

  const destinoActive = activeTab === "destinos" || !!currentDestination;
  const atividadeActive =
    activeTab === "atividades" || ACTIVITY_SLUGS.includes(currentCategory ?? "");
  const experienciaActive =
    activeTab === "experiencias" || EXPERIENCE_SLUGS.includes(currentCategory ?? "");

  return (
    <>
      {/* Tab row */}
      <div className="mx-auto max-w-[1240px] px-5 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <button
          type="button"
          onClick={() => toggle("destinos")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] font-semibold shrink-0 transition-colors ${
            destinoActive
              ? "bg-navy-800 border-navy-800 text-white"
              : "border-border-subtle text-text-strong hover:bg-surface-alt"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Destinos
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${activeTab === "destinos" ? "rotate-180" : ""}`}
          />
        </button>

        <button
          type="button"
          onClick={() => toggle("atividades")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] font-semibold shrink-0 transition-colors ${
            atividadeActive
              ? "bg-navy-800 border-navy-800 text-white"
              : "border-border-subtle text-text-strong hover:bg-surface-alt"
          }`}
        >
          Atividades
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${activeTab === "atividades" ? "rotate-180" : ""}`}
          />
        </button>

        <button
          type="button"
          onClick={() => toggle("experiencias")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] font-semibold shrink-0 transition-colors ${
            experienciaActive
              ? "bg-navy-800 border-navy-800 text-white"
              : "border-border-subtle text-text-strong hover:bg-surface-alt"
          }`}
        >
          Experiências
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${activeTab === "experiencias" ? "rotate-180" : ""}`}
          />
        </button>

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

      {/* Expanded panel */}
      {activeTab ? (
        <div className="border-t border-border-subtle bg-surface-alt">
          <div className="mx-auto max-w-[1240px] px-5 py-4">
            {activeTab === "destinos" && (
              <>
                <p className="text-[11.5px] font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Escolha o destino
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/atividades" className={chip(!currentDestination)}>
                    Todos
                  </Link>
                  {destinations.map((d) => (
                    <Link
                      key={d.id}
                      href={`/atividades?destino=${d.slug}`}
                      className={chip(d.slug === currentDestination)}
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              </>
            )}

            {activeTab === "atividades" && (
              <>
                <p className="text-[11.5px] font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Tipo de atividade
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/atividades" className={chip(!currentCategory)}>
                    Todas
                  </Link>
                  {activityCategories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/atividades?categoria=${c.slug}`}
                      className={chip(c.slug === currentCategory)}
                    >
                      {c.icon ? `${c.icon} ` : ""}
                      {c.name}
                    </Link>
                  ))}
                </div>
              </>
            )}

            {activeTab === "experiencias" && (
              <>
                <p className="text-[11.5px] font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Tipo de experiência
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/atividades" className={chip(!currentCategory)}>
                    Todas
                  </Link>
                  {experienceCategories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/atividades?categoria=${c.slug}`}
                      className={chip(c.slug === currentCategory)}
                    >
                      {c.icon ? `${c.icon} ` : ""}
                      {c.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function chip(active: boolean) {
  return `px-3 py-1.5 rounded-full border text-[13px] font-medium transition-colors ${
    active
      ? "bg-navy-800 border-navy-800 text-white"
      : "border-border-subtle text-text-strong hover:bg-white"
  }`;
}
