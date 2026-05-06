import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, MapPin } from "lucide-react";
import type { Destination } from "@/lib/types";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export async function DestinationRail({ destinations }: { destinations: Destination[] }) {
  const locale = await getLocale();
  return (
    <section className="relative bg-navy-800 text-white overflow-hidden">
      <div className="absolute inset-0 pattern-waves" aria-hidden />
      <span
        aria-hidden
        className="absolute -top-32 -right-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-30 bg-brand-orange"
      />
      <span
        aria-hidden
        className="absolute -bottom-40 -left-24 w-[400px] h-[400px] rounded-full blur-3xl opacity-20 bg-brand-yellow"
      />

      <div className="relative mx-auto max-w-[1240px] px-5 py-14">
        <div className="flex items-end justify-between mb-7 flex-wrap gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-brand-orange">
              <MapPin className="w-3.5 h-3.5" /> Algarve
            </span>
            <h2 className="font-display mt-1 text-3xl md:text-4xl font-extrabold text-white">
              {t(locale, "section.destinations.title")}
            </h2>
            <p className="mt-1 text-[13.5px] text-white/70 max-w-md">
              {t(locale, "section.destinations.lead")}
            </p>
          </div>
          <Link
            href="/atividades"
            className="text-[13.5px] font-semibold text-brand-yellow hover:text-white flex items-center gap-1"
          >
            {t(locale, "section.destinations.viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {destinations.map((d, i) => (
            <Link
              key={d.id}
              href={`/atividades?destino=${d.slug}`}
              className={`group relative h-[220px] rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-brand-yellow/60 transition ${
                i === 0 ? "lg:row-span-2 lg:h-[460px]" : ""
              }`}
            >
              <Image
                src={d.image}
                alt={d.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 240px"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(10,37,64,0.85) 100%)",
                }}
              />
              <button
                aria-label="Favoritar"
                className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-sm"
              >
                <Heart className="w-4 h-4" />
              </button>
              <div className="absolute left-4 bottom-4 right-4">
                <p className="font-display text-white text-[20px] font-extrabold leading-tight drop-shadow">
                  {d.name}
                </p>
                <p className="text-white/85 text-[12.5px] mt-0.5 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-brand-orange" />
                  {d.activities_count} atividades
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
