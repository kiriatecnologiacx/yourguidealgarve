"use client";

import { useEffect, useRef, useState } from "react";

function rezdyOrigin(src: string): string | null {
  try {
    const u = new URL(src);
    if (u.hostname.endsWith(".rezdy.com")) return u.origin;
  } catch { /* ignore */ }
  return null;
}

function ensureRezdyScript(origin: string): void {
  const id = "rezdy-plugin-js";
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.defer = true;
  s.type = "text/javascript";
  s.src = `${origin}/pluginJs`;
  document.head.append(s);
}

export function PartnerEmbeddedWidget({
  src,
  title = "Booking",
}: {
  src: string;
  title?: string;
}) {
  const [height, setHeight] = useState(820);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const origin = rezdyOrigin(src);
    if (origin) ensureRezdyScript(origin);
  }, [src]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const d = e.data;
      if (!d) return;
      const candidate =
        (typeof d === "object" && d.type === "yga-widget-height" && d.height) ||
        (typeof d === "object" && d.event === "resize" && d.height) ||
        (typeof d === "object" && typeof d.height === "number" && d.height) ||
        null;
      if (typeof candidate === "number" && candidate > 200) {
        setHeight(Math.min(3000, candidate + 60));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="w-full overflow-x-hidden" style={{ maxWidth: "100vw" }}>
      <iframe
        ref={iframeRef}
        title={title}
        src={src}
        className="rezdy w-full block"
        style={{ height, border: 0, background: "transparent", display: "block", maxWidth: "100%" }}
        seamless
        allow="payment *; clipboard-write"
        referrerPolicy="origin"
        loading="lazy"
        scrolling="auto"
      />
    </div>
  );
}
