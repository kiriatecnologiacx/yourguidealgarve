"use client";

import { useEffect, useState } from "react";

/**
 * Renders a partner booking widget by URL (e.g. Rezdy / FareHarbor / Pluralo
 * `?iframe=true` page). The iframe is sandboxed but allowed to run scripts and
 * navigate the user on click.
 */
export function PartnerWidgetFrame({
  src,
  title = "Booking",
}: {
  src: string;
  title?: string;
}) {
  const [height, setHeight] = useState(1100);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const d = event.data;
      // Many partner widgets dispatch resize events with different shapes — handle the common ones.
      if (d && typeof d === "object") {
        const candidate =
          (d.type === "yga-widget-height" && d.height) ||
          (d.event === "resize" && d.height) ||
          (typeof d.height === "number" && d.height) ||
          null;
        if (typeof candidate === "number" && candidate > 200) {
          setHeight(Math.min(3000, candidate + 40));
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      title={title}
      src={src}
      style={{ width: "100%", height, border: 0, background: "transparent" }}
      allow="payment *; clipboard-write"
      referrerPolicy="origin"
      loading="lazy"
    />
  );
}
