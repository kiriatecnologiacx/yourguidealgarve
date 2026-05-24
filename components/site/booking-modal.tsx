"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function BookingModal({
  src,
  title,
  onClose,
}: {
  src: string;
  title: string;
  onClose: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle shrink-0">
          <p className="text-[14px] font-semibold text-text-strong line-clamp-1">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="grid place-items-center w-8 h-8 rounded-full hover:bg-surface-alt text-text-muted hover:text-text-strong transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* iframe */}
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          className="w-full flex-1 border-0"
          style={{ minHeight: "520px" }}
          allow="payment"
        />
      </div>
    </div>
  );
}
