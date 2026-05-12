"use client";

import { useEffect, useState } from "react";
import { Calendar, Loader2 } from "lucide-react";

declare global {
  interface Window {
    rzdApp?: unknown;
  }
}

function extractRezdyHost(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith(".rezdy.com")) return u.origin;
  } catch {
    /* ignore */
  }
  return null;
}

function ensureRezdyScript(rezdyOrigin: string): Promise<void> {
  const id = "rezdy-plugin-js";
  if (document.getElementById(id)) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.defer = true;
    script.type = "text/javascript";
    script.src = `${rezdyOrigin}/pluginJs`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Rezdy script"));
    document.head.append(script);
  });
}

export function PartnerBookingButton({
  src,
  label = "Check availability & book",
  variant = "primary",
}: {
  src: string;
  label?: string;
  variant?: "primary" | "secondary";
}) {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const rezdyOrigin = extractRezdyHost(src);

  useEffect(() => {
    if (!rezdyOrigin) return;
    let cancelled = false;
    ensureRezdyScript(rezdyOrigin)
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, [rezdyOrigin]);

  function open() {
    setLoading(true);
    // The Rezdy pluginJs listens for postMessages of this shape and opens
    // its unified modal on top of the page.
    const iframeUrl = src.includes("?")
      ? src.replace(/\?iframe=true/i, "?iframe=1").replace(/&iframe=true/i, "&iframe=1")
      : `${src}?iframe=1`;
    window.postMessage(
      { url: iframeUrl, data: "", type: "rezdy_open_in_modal" },
      "*",
    );
    // Modal opens within ~1s; stop spinner shortly after.
    setTimeout(() => setLoading(false), 1500);
  }

  // Fallback: if Rezdy script can't be loaded (or host is not Rezdy), open
  // the booking URL in a new tab. Better than nothing — user still can book.
  function fallback() {
    window.open(src.replace(/[?&]iframe=true/i, ""), "_blank", "noopener,noreferrer");
  }

  const handleClick = () => {
    if (rezdyOrigin && ready) {
      open();
    } else {
      fallback();
    }
  };

  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-colors";
  const sizeClasses = "px-6 py-3.5 text-[15px]";
  const variantClasses =
    variant === "primary"
      ? "bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900"
      : "bg-navy-800 hover:bg-navy-900 text-white";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} w-full`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Calendar className="w-4 h-4" />
      )}
      {label}
    </button>
  );
}
