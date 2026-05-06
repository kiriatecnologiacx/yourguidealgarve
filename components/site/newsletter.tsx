"use client";

import { Mail } from "lucide-react";
import { t, type Locale } from "@/lib/i18n";

export function Newsletter({ locale }: { locale: Locale }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-8">
        <div className="relative overflow-hidden rounded-2xl bg-navy-800 text-white px-6 md:px-8 py-6 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-5">
          <div className="flex items-center gap-3 md:max-w-sm">
            <span className="grid place-items-center w-11 h-11 rounded-full bg-brand-yellow text-navy-900">
              <Mail className="w-5 h-5" />
            </span>
            <p className="text-[14.5px] leading-snug">
              {t(locale, "newsletter.title")}
            </p>
          </div>

          <form
            className="flex items-stretch bg-white rounded-xl overflow-hidden md:max-w-md w-full"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder={t(locale, "newsletter.placeholder")}
              className="flex-1 px-4 py-3 text-[13.5px] text-text-strong outline-none placeholder:text-text-muted"
            />
          </form>

          <button className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-5 py-3 rounded-xl text-[14px]">
            {t(locale, "newsletter.cta")}
          </button>

          <span
            aria-hidden
            className="hidden md:block absolute right-6 bottom-0 pointer-events-none"
          >
            <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
              <path d="M0 95 Q 30 88 60 92 T 120 92 L 120 100 L 0 100 Z" fill="#0e2a52" />
              <rect x="58" y="60" width="14" height="35" fill="#ffffff" />
              <rect x="56" y="55" width="18" height="6" fill="#ffcc00" />
              <rect x="58" y="65" width="14" height="4" fill="#ff8a3d" opacity="0.85" />
              <rect x="58" y="76" width="14" height="4" fill="#ff8a3d" opacity="0.85" />
              <rect x="58" y="87" width="14" height="4" fill="#ff8a3d" opacity="0.85" />
              <rect x="60" y="46" width="10" height="9" fill="#0a2540" stroke="#ffcc00" strokeWidth="1.5" />
              <rect x="62" y="42" width="6" height="5" fill="#ffcc00" />
              <path d="M58 42 L65 33 L72 42 Z" fill="#ffffff" />
              <path d="M65 50 L20 30 L18 38 Z" fill="#ffcc00" opacity="0.35" />
              <path d="M65 50 L110 30 L112 38 Z" fill="#ffcc00" opacity="0.35" />
              <circle cx="14" cy="18" r="1.2" fill="#ffffff" opacity="0.7" />
              <circle cx="100" cy="14" r="1.2" fill="#ffffff" opacity="0.7" />
              <circle cx="40" cy="10" r="0.8" fill="#ffffff" opacity="0.6" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
