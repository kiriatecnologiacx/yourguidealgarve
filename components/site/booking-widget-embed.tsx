"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders a partner booking widget (Rezdy / FareHarbor / Pluralo) inside a
 * sandboxed iframe so the partner's <script> tags execute safely without
 * affecting the parent page.
 */
export function BookingWidgetEmbed({ html }: { html: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(640);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.data &&
        typeof event.data === "object" &&
        event.data.type === "yga-widget-height" &&
        typeof event.data.height === "number"
      ) {
        setHeight(Math.max(320, Math.min(2000, event.data.height)));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const doc = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  html,body { margin:0; padding:0; font-family: ui-sans-serif, system-ui, -apple-system, "Plus Jakarta Sans", sans-serif; color:#0f1729; background:transparent; }
  body { padding: 4px; }
</style>
</head>
<body>
${html}
<script>
  (function () {
    function report() {
      var h = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      window.parent.postMessage({ type: 'yga-widget-height', height: h + 24 }, '*');
    }
    var obs = new MutationObserver(report);
    obs.observe(document.body, { childList: true, subtree: true, attributes: true });
    window.addEventListener('load', report);
    setTimeout(report, 500);
    setTimeout(report, 1500);
    setTimeout(report, 4000);
  })();
</script>
</body></html>`;

  return (
    <iframe
      ref={ref}
      title="Reservar"
      srcDoc={doc}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      style={{ width: "100%", height, border: 0, background: "transparent" }}
    />
  );
}
