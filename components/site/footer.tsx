import Link from "next/link";
import { Facebook, Instagram, Youtube, Twitter, ChevronDown } from "lucide-react";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Explorar",
    links: [
      { label: "Destinos", href: "/atividades?tab=destinos" },
      { label: "Atividades", href: "/atividades" },
      { label: "Experiências", href: "/atividades?tab=experiencias" },
      { label: "Ingressos", href: "/atividades?tab=ingressos" },
      { label: "Transfers", href: "/atividades?tab=transfers" },
      { label: "Ofertas", href: "/atividades?ofertas=1" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Ajuda & FAQ", href: "/ajuda" },
      { label: "Política de cancelamento", href: "/cancelamento" },
      { label: "Termos de uso", href: "/termos" },
      { label: "Política de privacidade", href: "/privacidade" },
      { label: "Fale conosco", href: "/contato" },
    ],
  },
  {
    title: "Sobre nós",
    links: [
      { label: "Quem somos", href: "/sobre" },
      { label: "Trabalhe conosco", href: "/carreiras" },
      { label: "Seja um parceiro", href: "/parceiros" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy-800 text-white/80">
      <div className="mx-auto max-w-[1240px] px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/65 max-w-sm">
              Descubra o melhor do Algarve com experiências selecionadas
              especialmente para você.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <SocialIcon icon={<Facebook className="w-4 h-4" />} />
              <SocialIcon icon={<Instagram className="w-4 h-4" />} />
              <SocialIcon icon={<Youtube className="w-4 h-4" />} />
              <SocialIcon icon={<Twitter className="w-4 h-4" />} />
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13.5px] font-semibold text-white mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-white/70 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-[13.5px] font-semibold text-white mb-4">
              Baixe nosso app
            </h4>
            <div className="flex flex-col gap-2">
              <StoreBadge store="App Store" />
              <StoreBadge store="Google Play" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1240px] px-5 py-5 flex flex-wrap items-center justify-between gap-3 text-[12.5px] text-white/60">
          <span>© 2026 Your Guide Algarve. Todos os direitos reservados.</span>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-white">
              Português (BR) <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-1 hover:text-white">
              BRL (R$) <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <span className="grid place-items-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer text-white">
      {icon}
    </span>
  );
}

function StoreBadge({ store }: { store: "App Store" | "Google Play" }) {
  const isApple = store === "App Store";
  return (
    <a
      href="#"
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/30 border border-white/15 hover:bg-black/40 transition-colors"
    >
      <span className="text-white">
        {isApple ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M16.5 1.5c-.05 1.2-.5 2.3-1.3 3.1-.8.9-2 1.6-3.2 1.5-.1-1.2.5-2.4 1.2-3.1.8-.9 2.1-1.6 3.3-1.5zM20.4 17.4c-.5 1.2-.8 1.7-1.5 2.8-1 1.5-2.4 3.4-4.1 3.4-1.5 0-1.9-1-4-1-2.1 0-2.5 1-4 1-1.7 0-3-1.7-4-3.2-2.8-4.1-3.1-9-1.3-11.6 1.2-1.8 3.1-2.9 4.9-2.9 1.8 0 3 1 4.5 1 1.4 0 2.3-1 4.5-1 1.6 0 3.3.9 4.5 2.4-4 2.2-3.3 7.9 1.5 9.1z" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path fill="#34A853" d="M3 4.5v15l8.5-7.5z" />
            <path fill="#FBBC05" d="M14.5 12L11.5 9 3 4.5z" opacity="0.85" />
            <path fill="#EA4335" d="M3 19.5l11.5-7.5L11.5 9z" opacity="0.85" />
            <path fill="#4285F4" d="M21 12l-6.5-3.5L11.5 12l3 3z" />
          </svg>
        )}
      </span>
      <span className="leading-tight">
        <span className="block text-[10px] uppercase tracking-wide text-white/70">
          {isApple ? "Disponível na" : "Disponível no"}
        </span>
        <span className="block text-[13px] font-semibold text-white">{store}</span>
      </span>
    </a>
  );
}
