"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    rzdApp?: unknown;
  }
}

function rezdyOriginFrom(src: string): string | null {
  try {
    const u = new URL(src);
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

/**
 * Renders a Rezdy calendarWidget iframe (narrow column with the date/time
 * picker and "Book now" button). pluginJs is auto-loaded and resizes the
 * iframe + opens the unified modal on checkout.
 */
export function PartnerCalendarWidget({
  src,
  title = "Booking calendar",
  height = 760,
}: {
  src: string;
  title?: string;
  height?: number;
}) {
  const [iframeHeight, setIframeHeight] = useState(height);

  useEffect(() => {
    const origin = rezdyOriginFrom(src);
    if (!origin) return;
    ensureRezdyScript(origin).catch(() => {
      /* swallow — iframe still loads, just without resize/modal hook */
    });
  }, [src]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const d = event.data;
      if (!d) return;
      // Rezdy/iFrameResizer dispatches resize messages with various shapes
      const candidate =
        (typeof d === "object" && d.type === "yga-widget-height" && d.height) ||
        (typeof d === "object" && d.event === "resize" && d.height) ||
        (typeof d === "object" && typeof d.height === "number" && d.height) ||
        null;
      if (typeof candidate === "number" && candidate > 200) {
        setIframeHeight(Math.min(2400, candidate + 40));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      title={title}
      src={src}
      className="rezdy w-full"
      style={{ height: iframeHeight, border: 0, background: "transparent" }}
      seamless
      allow="payment *; clipboard-write"
      referrerPolicy="origin"
      loading="lazy"
    />
  );
}
