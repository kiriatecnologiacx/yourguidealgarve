import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Logo } from "./logo";
import { LangSwitch } from "./lang-switch";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export async function SiteFooter() {
  const locale = await getLocale();
  return (
    <footer className="bg-navy-800 text-white/85">
      <div className="mx-auto max-w-[1240px] px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_auto] gap-8 md:gap-10 items-start">
          <div>
            <Logo />
            <p className="mt-3 text-[13px] leading-relaxed text-white/65 max-w-md">
              {t(locale, "footer.tagline")}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <SocialIcon href="https://instagram.com/yourguidealgarve" icon={<Instagram className="w-4 h-4" />} label="Instagram" />
              <SocialIcon href="https://facebook.com/yourguidealgarve" icon={<Facebook className="w-4 h-4" />} label="Facebook" />
              <SocialIcon href="https://youtube.com/@yourguidealgarve" icon={<Youtube className="w-4 h-4" />} label="YouTube" />
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white mb-3">
              {t(locale, "footer.about")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre" className="text-[13px] text-white/70 hover:text-white">
                  {t(locale, "footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/parceiros" className="text-[13px] text-white/70 hover:text-white">
                  {t(locale, "footer.partner")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-white mb-3">
              {t(locale, "footer.legal")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacidade" className="text-[13px] text-white/70 hover:text-white">
                  {t(locale, "footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-[13px] text-white/70 hover:text-white">
                  {t(locale, "footer.terms")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="self-start">
            <LangSwitch current={locale} />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1240px] px-5 py-4 flex flex-wrap items-center justify-between gap-2 text-[12px] text-white/60">
          <span>© 2026 Your Guide Algarve. {t(locale, "footer.rights")}</span>
          <span>
            {t(locale, "footer.copy")} ·{" "}
            <a
              href="https://instagram.com/kiria.cx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange hover:text-brand-orange-hover font-semibold"
            >
              @kiria.cx
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid place-items-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
    >
      {icon}
    </a>
  );
}
