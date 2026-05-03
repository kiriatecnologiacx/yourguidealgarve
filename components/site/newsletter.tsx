import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-8">
        <div className="relative overflow-hidden rounded-2xl bg-navy-800 text-white px-6 md:px-8 py-6 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-5">
          <div className="flex items-center gap-3 md:max-w-sm">
            <span className="grid place-items-center w-11 h-11 rounded-full bg-brand-yellow text-navy-900">
              <Mail className="w-5 h-5" />
            </span>
            <p className="text-[14.5px] leading-snug">
              Receba ofertas exclusivas e inspirações <br className="hidden md:block" />
              direto no seu e-mail
            </p>
          </div>

          <form
            className="flex items-stretch bg-white rounded-xl overflow-hidden md:max-w-md w-full"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 text-[13.5px] text-text-strong outline-none placeholder:text-text-muted"
            />
          </form>

          <button className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-5 py-3 rounded-xl text-[14px]">
            Quero receber
          </button>

          <span aria-hidden className="absolute -right-6 -bottom-6 opacity-25">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="58" stroke="#ffcc00" strokeWidth="2" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
