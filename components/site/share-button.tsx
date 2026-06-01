"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export function ShareButton({ title, label, copiedLabel }: { title: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1 hover:text-text-strong transition-colors"
    >
      {copied ? (
        <><Check className="w-4 h-4 text-success" /> {copiedLabel}</>
      ) : (
        <><Share2 className="w-4 h-4" /> {label}</>
      )}
    </button>
  );
}
