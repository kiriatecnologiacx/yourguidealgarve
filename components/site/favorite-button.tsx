"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { t, type Locale } from "@/lib/i18n";

export function FavoriteButton({
  tourId,
  initial,
  isAuthed,
  locale = "en",
  variant = "card",
}: {
  tourId: string;
  initial: boolean;
  isAuthed: boolean;
  locale?: Locale;
  variant?: "card" | "hero";
}) {
  const router = useRouter();
  const [active, setActive] = useState(initial);
  const [, start] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) {
      router.push("/entrar?next=" + encodeURIComponent(window.location.pathname));
      return;
    }
    const next = !active;
    setActive(next);
    start(async () => {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tourId, action: next ? "add" : "remove" }),
      });
      router.refresh();
    });
  }

  const cls =
    variant === "hero"
      ? "grid place-items-center w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-sm"
      : "grid place-items-center w-8 h-8 rounded-full bg-white/90 hover:bg-white text-navy-700";

  return (
    <button
      type="button"
      aria-label={active ? t(locale, "aria.removeFavorite") : t(locale, "aria.addFavorite")}
      onClick={toggle}
      className={cls}
    >
      <Heart className={`w-4 h-4 ${active ? "fill-brand-orange text-brand-orange" : ""}`} />
    </button>
  );
}
