"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { LOCALES, type Locale } from "@/lib/i18n";
import { useRouter } from "next/navigation";

export function LangSwitch({
  current,
  variant = "light",
}: {
  current: Locale;
  variant?: "light" | "dark";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  function pick(code: Locale) {
    document.cookie = `yga_lang=${code}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setOpen(false);
    router.refresh();
  }

  const item = LOCALES.find((l) => l.code === current) ?? LOCALES[0];
  const isLight = variant === "light";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-medium ${
          isLight
            ? "text-white/85 hover:text-white hover:bg-white/5"
            : "text-text-strong hover:bg-surface-alt"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.flagUrl} alt={item.label} className="w-5 h-3.5 object-cover rounded-[2px] shrink-0" />
        <span className="hidden sm:inline">{item.label}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>
      {open ? (
        <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-lg shadow-lg border border-border-subtle z-50 py-1 overflow-hidden">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => pick(l.code)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-[13px] hover:bg-surface-alt ${
                l.code === current ? "text-navy-800 font-semibold" : "text-text-strong"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.flagUrl} alt={l.label} className="w-5 h-3.5 object-cover rounded-[2px] shrink-0" />
              {l.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
