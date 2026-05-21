"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, Map, X } from "lucide-react";
import type { Category, Destination } from "@/lib/types";

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
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <div className="mx-auto max-w-[1240px] px-5 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[13px] font-medium shrink-0 transition-colors ${
            showFilters
              ? "bg-navy-800 border-navy-800 text-white"
              : "border-border-subtle text-text-strong hover:bg-surface-alt"
          }`}
        >
          {showFilters ? <X className="w-3.5 h-3.5" /> : <Filter className="w-3.5 h-3.5" />}
          Filtros
        </button>
        <a
          href="https://maps.google.com/?q=Algarve,Portugal"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-subtle text-[13px] font-medium text-text-strong hover:bg-surface-alt shrink-0"
        >
          <Map className="w-3.5 h-3.5" /> Mapa
        </a>
        <span className="w-px h-5 bg-border-subtle mx-1 shrink-0" />
        {categories.slice(0, 8).map((cat) => (
          <Link
            key={cat.id}
            href={`/atividades?categoria=${cat.slug}`}
            className={`px-3 py-1.5 rounded-full border text-[13px] font-medium whitespace-nowrap shrink-0 ${
              cat.slug === currentCategory
                ? "bg-navy-800 border-navy-800 text-white"
                : "border-border-subtle text-text-strong hover:bg-surface-alt"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {showFilters ? (
        <div className="border-t border-border-subtle bg-surface-alt">
          <div className="mx-auto max-w-[1240px] px-5 py-4">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-text-muted mb-3">Destino</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/atividades"
                className={`px-3 py-1.5 rounded-full border text-[13px] font-medium ${
                  !currentDestination
                    ? "bg-navy-800 border-navy-800 text-white"
                    : "border-border-subtle text-text-strong hover:bg-white"
                }`}
              >
                Todos
              </Link>
              {destinations.map((d) => (
                <Link
                  key={d.id}
                  href={`/atividades?destino=${d.slug}`}
                  className={`px-3 py-1.5 rounded-full border text-[13px] font-medium ${
                    d.slug === currentDestination
                      ? "bg-navy-800 border-navy-800 text-white"
                      : "border-border-subtle text-text-strong hover:bg-white"
                  }`}
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
