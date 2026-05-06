import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "./search-bar";
import { Typewriter } from "./typewriter";

const POPULAR = [
  { label: "Benagil", href: "/atividades?destino=benagil" },
  { label: "Lagos", href: "/atividades?destino=lagos" },
  { label: "Faro", href: "/atividades?destino=faro" },
  { label: "Albufeira", href: "/atividades?destino=albufeira" },
  { label: "Portimão", href: "/atividades?destino=portimao" },
  { label: "Vilamoura", href: "/atividades?destino=vilamoura" },
  { label: "Tavira", href: "/atividades?destino=tavira" },
];

const TYPED_PHRASES = [
  "Descubra o melhor do Algarve",
  "Viva experiências inesquecíveis",
  "Encontre o passeio perfeito",
  "Conheça praias, cavernas e sabores",
];

export function Hero() {
  return (
    <section className="relative bg-navy-800 text-white overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1602410465647-ad9d04ce91a4?auto=format&fit=crop&w=2200&q=80"
        alt="Algarve cliffs"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 hero-overlay" aria-hidden />

      <div className="relative mx-auto max-w-[1240px] px-5 pt-16 pb-12 md:pt-24 md:pb-20">
        <p className="text-brand-yellow font-semibold text-[15px] md:text-[17px] mb-3 italic min-h-[24px]">
          <Typewriter phrases={TYPED_PHRASES} />
        </p>
        <h1 className="font-display text-white font-extrabold text-4xl md:text-5xl lg:text-[58px] leading-[1.05] tracking-tight max-w-3xl">
          As melhores experiências, <br className="hidden md:block" />
          reservadas <span className="text-brand-yellow">por você.</span>
        </h1>
        <p className="mt-4 text-white/85 text-[15px] max-w-xl">
          Atividades, tours, ingressos e experiências inesquecíveis em todo o
          Algarve.
        </p>

        <div className="mt-7">
          <SearchBar />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-white/85 mr-1">Populares:</span>
          {POPULAR.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="bg-white/10 hover:bg-white/20 text-white text-[13px] px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/15"
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
