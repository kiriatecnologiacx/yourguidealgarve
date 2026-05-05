import { Star } from "lucide-react";
import Image from "next/image";

const REVIEWS = [
  {
    name: "Mariana S.",
    date: "Mai 2026",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    title: "Experiência incrível! O guia foi super atencioso e a Gruta de Benagil é ainda mais linda ao vivo. Recomendo muito!",
  },
  {
    name: "Carlos T.",
    date: "Abr 2026",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=120&q=80",
    title:
      "Tudo perfeito, desde o atendimento até o passeio em si. A Gruta de Benagil é linda mesmo!",
  },
  {
    name: "Juliana M.",
    date: "Abr 2026",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    title:
      "Vale cada minuto! Barco confortável, guia simpático, vistas incríveis. Voltaria com certeza.",
  },
];

const DISTRIBUTION = [
  { stars: 5, pct: 87 },
  { stars: 4, pct: 10 },
  { stars: 3, pct: 2 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 },
];

export function ReviewsSection({
  rating,
  reviewsCount,
}: {
  rating: number | null;
  reviewsCount: number;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-[18px] font-bold text-text-strong">
        Avaliações de quem já fez
      </h2>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 items-start">
        <div>
          <p className="text-[44px] font-extrabold text-text-strong leading-none">
            {(rating ?? 0).toFixed(1).replace(".", ",")}
          </p>
          <span className="flex mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-brand-yellow text-brand-yellow"
              />
            ))}
          </span>
          <p className="mt-1 text-[13px] text-text-muted">
            {reviewsCount.toLocaleString("pt-BR")} avaliações
          </p>
          <button className="mt-3 inline-flex bg-white border border-navy-700 text-navy-800 font-semibold px-4 py-2 rounded-lg text-[13px] hover:bg-surface-alt">
            Escrever avaliação
          </button>
        </div>

        <div className="space-y-2">
          {DISTRIBUTION.map((d) => (
            <div key={d.stars} className="flex items-center gap-3 text-[12.5px]">
              <span className="w-4 text-text-strong font-semibold">{d.stars}</span>
              <Star className="w-3.5 h-3.5 fill-brand-yellow text-brand-yellow shrink-0" />
              <div className="flex-1 h-2 rounded-full bg-surface-alt overflow-hidden">
                <div
                  className="h-full bg-brand-yellow"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="w-9 text-text-muted text-right">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {REVIEWS.map((r) => (
          <div
            key={r.name}
            className="rounded-xl border border-border-subtle p-4 bg-white"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-surface-alt shrink-0">
                <Image src={r.avatar} alt={r.name} fill sizes="36px" className="object-cover" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-text-strong">
                  {r.name}
                </p>
                <p className="text-[11.5px] text-text-muted">{r.date}</p>
              </div>
            </div>
            <span className="flex mt-2 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-brand-yellow text-brand-yellow"
                />
              ))}
            </span>
            <p className="text-[13px] text-text-strong/85 leading-snug">
              {r.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
