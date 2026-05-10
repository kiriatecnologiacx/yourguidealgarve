import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, MapPin } from "lucide-react";
import type { Destination } from "@/lib/types";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export async function DestinationRail({
  destinations,
}: {
  destinations: Destination[];
}) {
  const locale = await getLocale();

  return (
    <section className="relative text-white overflow-hidden">
      {/* Backdrop photo (Rui's pine + coast shot) */}
      <Image
        src="/photos/destinations-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center -z-10"
        aria-hidden
      />
      {/* Warm wash + grain texture stack */}
      <div className="absolute inset-0 warm-wash" aria-hidden />
      <div className="absolute inset-0 grain pointer-events-none" aria-hidden />

      {/* Top wave divider blends into the previous white section */}
      <span aria-hidden className="absolute top-0 left-0 right-0 -translate-y-px">
        <WaveDivider />
      </span>

      <div className="relative mx-auto max-w-[1240px] px-5 pt-24 pb-20">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-brand-yellow drop-shadow">
              <MapPin className="w-3.5 h-3.5" /> Algarve
            </span>
            <h2 className="font-display mt-1 text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)]">
              {t(locale, "section.destinations.title")}
            </h2>
            <p className="mt-1 text-[13.5px] text-white/85 max-w-md drop-shadow">
              {t(locale, "section.destinations.lead")}
            </p>
          </div>
          <Link
            href="/atividades"
            className="inline-flex items-center gap-1 bg-white text-navy-800 hover:bg-brand-yellow hover:text-navy-900 font-semibold px-5 py-2.5 rounded-full text-[13.5px] transition-colors"
          >
            {t(locale, "section.destinations.viewAll")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {destinations.map((d, i) => (
            <Link
              key={d.id}
              href={`/atividades?destino=${d.slug}`}
              className={`group relative h-[230px] rounded-2xl overflow-hidden ring-1 ring-white/40 hover:ring-brand-yellow hover:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.45)] transition ${
                i === 0 ? "lg:row-span-2 lg:h-[480px]" : ""
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
                    "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(10,37,64,0.88) 100%)",
                }}
              />
              <button
                aria-label="Save to favorites"
                className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-white/90 hover:bg-white text-navy-700 backdrop-blur-sm shadow-md"
              >
                <Heart className="w-4 h-4" />
              </button>
              <div className="absolute left-4 bottom-4 right-4">
                <p className="font-display text-white text-[20px] font-extrabold leading-tight drop-shadow">
                  {d.name}
                </p>
                <p className="text-white/90 text-[12.5px] mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                  {d.activities_count} activities
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom wave divider into the next white section */}
      <span aria-hidden className="absolute bottom-0 left-0 right-0 translate-y-px rotate-180">
        <WaveDivider />
      </span>
    </section>
  );
}

function WaveDivider() {
  return (
    <svg
      viewBox="0 0 1440 60"
      width="100%"
      height="60"
      preserveAspectRatio="none"
      fill="#ffffff"
      aria-hidden
    >
      <path d="M0,32 C240,68 480,4 720,28 C960,52 1200,12 1440,40 L1440,0 L0,0 Z" />
    </svg>
  );
}
