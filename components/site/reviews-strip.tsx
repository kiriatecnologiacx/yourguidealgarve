import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const REVIEWS = [
  {
    name: "Mariana S.",
    title: "Incrível experiência nas grutas!",
    body: "Tudo perfeito do início ao fim.",
  },
  {
    name: "Carlos T.",
    title: "Atendimento excelente e passeio inesquecível. Recomendo!",
    body: "",
  },
  {
    name: "Juliana M.",
    title: "Fácil de reservar, preços justos e lugar maravilhoso!",
    body: "",
  },
];

export function ReviewsStrip() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-10 border-t border-border-subtle">
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
          <div className="md:w-[260px] shrink-0">
            <p className="text-[15px] font-bold text-text-strong">
              Avaliado por quem já viveu
            </p>
            <p className="mt-1 text-[13px] text-text-muted">Excelente</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 tp-star fill-[#00b67a]"
                  />
                ))}
              </span>
              <span className="text-[13px] font-semibold text-text-strong">4.8/5</span>
            </div>
            <p className="mt-1 text-[12px] text-text-muted flex items-center gap-1">
              <Star className="w-3 h-3 tp-star fill-[#00b67a]" /> Trustpilot
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                className="rounded-xl border border-border-subtle p-4"
              >
                <span className="flex mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 tp-star fill-[#00b67a]"
                    />
                  ))}
                </span>
                <p className="text-[13px] font-semibold text-text-strong leading-snug">
                  {r.title}
                </p>
                {r.body ? (
                  <p className="text-[12.5px] text-text-muted mt-1">{r.body}</p>
                ) : null}
                <p className="mt-3 text-[12px] text-text-muted">{r.name}</p>
              </div>
            ))}
          </div>

          <div className="flex md:flex-col gap-2 md:gap-2 self-end md:self-center">
            <button
              aria-label="Anterior"
              className="grid place-items-center w-9 h-9 rounded-full border border-border-subtle text-navy-700 hover:bg-surface-alt"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              aria-label="Próximo"
              className="grid place-items-center w-9 h-9 rounded-full border border-border-subtle text-navy-700 hover:bg-surface-alt"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
