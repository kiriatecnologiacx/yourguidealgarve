"use client";

import { MapPin, Calendar as CalendarIcon, Users, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import { formatPriceBRL } from "@/lib/utils";

type Suggestion = {
  tours: { id: string; slug: string; title: string; cover_image: string | null; price_from_brl: number | null; price_brl: number | null }[];
  destinations: { id: string; slug: string; name: string; image: string; activities_count: number }[];
};

export function SearchBar({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setSuggestions(null);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data: Suggestion = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.tours.length > 0 || data.destinations.length > 0);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 280);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (date) params.set("data", date);
    router.push(`/atividades${params.size > 0 ? `?${params}` : ""}`);
  }

  const hasSuggestions =
    showSuggestions &&
    suggestions &&
    (suggestions.tours.length > 0 || suggestions.destinations.length > 0);

  return (
    <div className="relative max-w-[920px]">
      <form
        ref={containerRef}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-[0_20px_50px_-20px_rgba(10,37,64,0.45)] p-2.5 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_auto] gap-2"
      >
        {/* Where */}
        <label className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-surface-alt cursor-text relative md:border-r md:border-border-subtle">
          <MapPin className="w-4 h-4 text-navy-600 shrink-0" />
          <span className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-text-strong uppercase tracking-wide">
              {t(locale, "search.where.label")}
            </span>
            <input
              type="text"
              placeholder={t(locale, "search.where.placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (suggestions && (suggestions.tours.length > 0 || suggestions.destinations.length > 0)) {
                  setShowSuggestions(true);
                }
              }}
              className="bg-transparent text-[13.5px] text-text-strong placeholder:text-text-muted outline-none w-full mt-0.5"
              autoComplete="off"
            />
          </span>
          {loading ? (
            <span className="w-3 h-3 border-2 border-navy-400 border-t-transparent rounded-full animate-spin shrink-0" />
          ) : null}
        </label>

        {/* Date */}
        <label className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-surface-alt cursor-pointer md:border-r md:border-border-subtle">
          <CalendarIcon className="w-4 h-4 text-navy-600 shrink-0" />
          <span className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-text-strong uppercase tracking-wide">
              {t(locale, "search.date.label")}
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="bg-transparent text-[13.5px] text-text-strong outline-none w-full mt-0.5 cursor-pointer"
              style={{ colorScheme: "light" }}
            />
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-[14px] transition-colors"
        >
          <Search className="w-4 h-4" />
          {t(locale, "search.cta")}
        </button>
      </form>

      {/* Suggestions dropdown */}
      {hasSuggestions ? (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(10,37,64,0.3)] border border-border-subtle overflow-hidden z-50">
          {suggestions!.destinations.length > 0 ? (
            <div className="px-3 pt-3 pb-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted px-2 mb-2">
                Destinos
              </p>
              {suggestions!.destinations.map((d) => (
                <Link
                  key={d.id}
                  href={`/atividades?destino=${d.slug}`}
                  onClick={() => { setShowSuggestions(false); setQuery(d.name); }}
                  className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-alt"
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-alt">
                    {d.image ? (
                      <Image src={d.image} alt={d.name} fill className="object-cover" sizes="40px" unoptimized />
                    ) : (
                      <MapPin className="w-4 h-4 m-auto text-text-muted" />
                    )}
                  </div>
                  <div>
                    <p className="text-[13.5px] font-semibold text-text-strong">{d.name}</p>
                    <p className="text-[12px] text-text-muted">{d.activities_count} atividades</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}

          {suggestions!.tours.length > 0 ? (
            <div className="px-3 pb-3 pt-1">
              {suggestions!.destinations.length > 0 ? (
                <div className="border-t border-border-subtle my-2" />
              ) : null}
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted px-2 mb-2">
                Passeios
              </p>
              {suggestions!.tours.map((tour) => (
                <Link
                  key={tour.id}
                  href={`/atividades/${tour.slug}`}
                  onClick={() => setShowSuggestions(false)}
                  className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-alt"
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-alt">
                    {tour.cover_image ? (
                      <Image
                        src={tour.cover_image}
                        alt={tour.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                        unoptimized
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-text-strong line-clamp-1">{tour.title}</p>
                    {(tour.price_from_brl ?? tour.price_brl) ? (
                      <p className="text-[12px] text-text-muted">
                        A partir de {formatPriceBRL(tour.price_from_brl ?? tour.price_brl)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : null}

          {suggestions!.tours.length === 0 && suggestions!.destinations.length === 0 ? (
            <p className="px-5 py-4 text-[13.5px] text-text-muted">
              Nenhum resultado para "{query}"
            </p>
          ) : null}
        </div>
      ) : query.length >= 2 && !loading && suggestions && suggestions.tours.length === 0 && suggestions.destinations.length === 0 ? (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(10,37,64,0.3)] border border-border-subtle z-50">
          <p className="px-5 py-4 text-[13.5px] text-text-muted">
            Nenhum resultado para &quot;{query}&quot;
          </p>
        </div>
      ) : null}
    </div>
  );
}
