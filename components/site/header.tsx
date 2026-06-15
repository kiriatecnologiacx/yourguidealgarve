import Link from "next/link";
import { Heart } from "lucide-react";
import { Logo } from "./logo";
import { LangSwitch } from "./lang-switch";
import { MobileMenu } from "./mobile-menu";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export async function SiteHeader() {
  const locale = await getLocale();

  const NAV = [
    { label: t(locale, "nav.destinations"), href: "/atividades?modo=destinos" },
    { label: t(locale, "nav.activities"),   href: "/atividades?modo=atividades" },
    { label: t(locale, "nav.blog"),         href: "/blog" },
    { label: t(locale, "nav.contact"),      href: "/contacto" },
    { label: t(locale, "nav.faq"),          href: "/faq" },
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
          <LangSwitch current={locale} />
          <MobileMenu nav={NAV} favoritesLabel={t(locale, "header.favorites")} menuLabel={t(locale, "nav.menu")} />
        </div>
      </div>
    </header>
  );
}
