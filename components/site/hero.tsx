import Link from "next/link";
import { SearchBar } from "./search-bar";
import { Typewriter } from "./typewriter";
import { HeroSlideshow } from "./hero-slideshow";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

const POPULAR = [
  { label: "Benagil", href: "/atividades?destino=benagil" },
  { label: "Lagos", href: "/atividades?destino=lagos" },
  { label: "Faro", href: "/atividades?destino=faro" },
  { label: "Albufeira", href: "/atividades?destino=albufeira" },
  { label: "Portimão", href: "/atividades?destino=portimao" },
  { label: "Vilamoura", href: "/atividades?destino=vilamoura" },
  { label: "Tavira", href: "/atividades?destino=tavira" },
];

const HERO_IMAGES = [
  { src: "/photos/hero-1.jpg", alt: "Algarve coastline with golden cliffs" },
  { src: "/photos/hero-3.jpg", alt: "Praia da Falésia long sandy beach" },
  { src: "/photos/hero-2.jpg", alt: "Algarve coast panoramic view" },
];

export async function Hero() {
  const locale = await getLocale();
  const phrases = [
    t(locale, "hero.eyebrow.0"),
    t(locale, "hero.eyebrow.1"),
    t(locale, "hero.eyebrow.2"),
    t(locale, "hero.eyebrow.3"),
  ];
  return (
    <section className="relative bg-navy-800 text-white overflow-hidden">
      <HeroSlideshow images={HERO_IMAGES} />
      <div className="absolute inset-0 hero-overlay" aria-hidden />

      <div className="relative mx-auto max-w-[1240px] px-5 pt-16 pb-16 md:pt-24 md:pb-24">
        <p className="text-brand-yellow font-semibold text-[15px] md:text-[17px] mb-3 italic min-h-[24px] drop-shadow">
          <Typewriter phrases={phrases} />
        </p>
        <h1 className="font-display text-white font-extrabold text-4xl md:text-5xl lg:text-[58px] leading-[1.05] tracking-tight max-w-3xl drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)]">
          {t(locale, "hero.title.lead")} <br className="hidden md:block" />
          {t(locale, "hero.title.tail")}{" "}
          <span className="text-brand-yellow">{t(locale, "hero.title.mark")}</span>
        </h1>
        <p className="mt-4 text-white/90 text-[15px] max-w-xl drop-shadow">
          {t(locale, "hero.subtitle")}
        </p>

        <div className="mt-7">
          <SearchBar locale={locale} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-white/90 mr-1 drop-shadow">
            {t(locale, "hero.popular")}
          </span>
          {POPULAR.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="bg-white/15 hover:bg-white/25 text-white text-[13px] px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20"
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
