import Link from "next/link";
import { Heart, ShoppingCart, Headphones, ChevronDown, Check } from "lucide-react";
import { Logo } from "./logo";

const NAV = [
  { label: "Destinos", href: "/atividades?tab=destinos" },
  { label: "Atividades", href: "/atividades" },
  { label: "Experiências", href: "/atividades?tab=experiencias" },
  { label: "Ingressos", href: "/atividades?tab=ingressos" },
  { label: "Transfers", href: "/atividades?tab=transfers" },
  { label: "Ofertas", href: "/atividades?ofertas=1" },
];

export function SiteHeader() {
  return (
    <header className="bg-navy-800 text-white">
      <div className="border-b border-white/10 text-[12.5px]">
        <div className="mx-auto max-w-[1240px] px-5 h-9 flex items-center justify-between">
          <div className="flex items-center gap-1.5 opacity-90">
            <Headphones className="w-3.5 h-3.5" />
            <span>Suporte 24/7</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 opacity-90">
            <Check className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Cancelamento gratuito na maioria das atividades</span>
          </div>
          <button className="flex items-center gap-1 opacity-90 hover:opacity-100">
            BRL (R$) <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-5 h-[68px] flex items-center gap-6">
        <Logo />
        <nav className="hidden lg:flex items-center gap-1 ml-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-[14px] font-medium text-white/85 hover:text-white rounded-md hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/favoritos"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-[13.5px] text-white/85 hover:text-white rounded-md hover:bg-white/5"
          >
            <Heart className="w-4 h-4" /> Favoritos
          </Link>
          <Link
            href="/carrinho"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-[13.5px] text-white/85 hover:text-white rounded-md hover:bg-white/5"
          >
            <ShoppingCart className="w-4 h-4" /> Carrinho
          </Link>
          <Link
            href="/admin/login"
            className="bg-brand-yellow text-navy-900 hover:bg-brand-yellow-hover px-5 py-2 rounded-md text-[14px] font-semibold transition-colors"
          >
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}
