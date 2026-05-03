import Image from "next/image";

export function AppPromo() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#eaf4ff] to-[#dceaff] p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="relative z-10">
            <span className="inline-block bg-brand-yellow text-navy-900 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md mb-4">
              Novo
            </span>
            <h3 className="text-3xl md:text-[34px] font-extrabold text-navy-800 leading-[1.1]">
              Seu guia de bolso <br />
              para o Algarve
            </h3>
            <p className="mt-3 text-[14px] text-navy-700/80 max-w-md">
              Baixe nosso app e tenha as melhores experiências na palma da sua
              mão, onde estiver.
            </p>

            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M16.5 1.5c-.05 1.2-.5 2.3-1.3 3.1-.8.9-2 1.6-3.2 1.5-.1-1.2.5-2.4 1.2-3.1.8-.9 2.1-1.6 3.3-1.5zM20.4 17.4c-.5 1.2-.8 1.7-1.5 2.8-1 1.5-2.4 3.4-4.1 3.4-1.5 0-1.9-1-4-1-2.1 0-2.5 1-4 1-1.7 0-3-1.7-4-3.2-2.8-4.1-3.1-9-1.3-11.6 1.2-1.8 3.1-2.9 4.9-2.9 1.8 0 3 1 4.5 1 1.4 0 2.3-1 4.5-1 1.6 0 3.3.9 4.5 2.4-4 2.2-3.3 7.9 1.5 9.1z" />
                </svg>
                <span className="leading-tight text-left">
                  <span className="block text-[10px] uppercase tracking-wide text-white/70">Disponível na</span>
                  <span className="block text-[13px] font-semibold">App Store</span>
                </span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#34A853" d="M3 4.5v15l8.5-7.5z" />
                  <path fill="#FBBC05" d="M14.5 12L11.5 9 3 4.5z" opacity="0.85" />
                  <path fill="#EA4335" d="M3 19.5l11.5-7.5L11.5 9z" opacity="0.85" />
                  <path fill="#4285F4" d="M21 12l-6.5-3.5L11.5 12l3 3z" />
                </svg>
                <span className="leading-tight text-left">
                  <span className="block text-[10px] uppercase tracking-wide text-white/70">Disponível no</span>
                  <span className="block text-[13px] font-semibold">Google Play</span>
                </span>
              </a>
              <div className="hidden md:grid place-items-center w-[72px] h-[72px] rounded-xl bg-white border border-border-subtle">
                <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
                  {Array.from({ length: 7 }).flatMap((_, r) =>
                    Array.from({ length: 7 }).map((_, c) => {
                      const isCorner =
                        (r < 2 && c < 2) ||
                        (r < 2 && c > 4) ||
                        (r > 4 && c < 2);
                      const fill =
                        isCorner ||
                        ((r * 7 + c) % 3 === 0 && !(r === 3 && c === 3));
                      return fill ? (
                        <rect
                          key={`${r}-${c}`}
                          x={4 + c * 7}
                          y={4 + r * 7}
                          width={6}
                          height={6}
                          fill="#0a2540"
                        />
                      ) : null;
                    }),
                  )}
                </svg>
              </div>
            </div>
          </div>

          <div className="relative h-[280px] md:h-[320px]">
            <div className="absolute right-0 top-0 w-[180px] md:w-[220px] h-full rounded-2xl overflow-hidden shadow-xl rotate-2">
              <Image
                src="https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&w=600&q=80"
                alt="App preview"
                fill
                className="object-cover"
                sizes="220px"
              />
            </div>
            <div className="absolute right-[140px] md:right-[180px] top-6 w-[180px] md:w-[220px] h-[88%] rounded-2xl overflow-hidden shadow-2xl bg-white border border-white/30 -rotate-3">
              <div className="relative h-[60%]">
                <Image
                  src="https://images.unsplash.com/photo-1597577183330-5cf2a5c6e63b?auto=format&fit=crop&w=600&q=80"
                  alt="Tour preview"
                  fill
                  className="object-cover"
                  sizes="220px"
                />
              </div>
              <div className="p-3">
                <p className="text-[12px] font-semibold text-text-strong">
                  Passeio de barco
                </p>
                <p className="text-[10.5px] text-text-muted">Grutas de Benagil</p>
                <p className="text-[10.5px] text-text-muted mt-1">
                  ★ ★ ★ ★ ★ <span className="text-text-strong">4.9</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
