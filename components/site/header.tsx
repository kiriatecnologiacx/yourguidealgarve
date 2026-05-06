import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Logo } from "./logo";
import { LangSwitch } from "./lang-switch";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function SiteHeader() {
  const locale = await getLocale();
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const NAV = [
    { label: t(locale, "nav.destinations"), href: "/atividades?tab=destinos" },
    { label: t(locale, "nav.activities"),   href: "/atividades" },
    { label: t(locale, "nav.experiences"),  href: "/atividades?tab=experiencias" },
    { label: t(locale, "nav.tickets"),      href: "/atividades?tab=ingressos" },
    { label: t(locale, "nav.transfers"),    href: "/atividades?tab=transfers" },
    { label: t(locale, "nav.blog"),         href: "/blog" },
  ];

  return (
    <header className="bg-navy-800 text-white">
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
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            href="/favoritos"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-[13.5px] text-white/85 hover:text-white rounded-md hover:bg-white/5"
          >
            <Heart className="w-4 h-4" /> {t(locale, "header.favorites")}
          </Link>
          <Link
            href="/carrinho"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-[13.5px] text-white/85 hover:text-white rounded-md hover:bg-white/5"
          >
            <ShoppingCart className="w-4 h-4" /> {t(locale, "header.cart")}
          </Link>

          <LangSwitch current={locale} />

          {user ? (
            <Link
              href="/conta"
              className="bg-brand-yellow text-navy-900 hover:bg-brand-yellow-hover px-4 py-2 rounded-md text-[13.5px] font-semibold transition-colors"
            >
              {user.email?.split("@")[0]}
            </Link>
          ) : (
            <Link
              href="/entrar"
              className="bg-brand-yellow text-navy-900 hover:bg-brand-yellow-hover px-5 py-2 rounded-md text-[14px] font-semibold transition-colors"
            >
              {t(locale, "header.signIn")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
