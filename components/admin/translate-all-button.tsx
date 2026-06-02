"use client";

import { useState } from "react";
import { Languages, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function TranslateAllButton() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [info, setInfo] = useState<string>("");

  async function run() {
    setState("loading");
    setInfo("");
    try {
      const res = await fetch("/admin/translate-all");
      const json = await res.json();
      if (!res.ok) {
        setState("error");
        setInfo(json.error ?? "Erro desconhecido");
        return;
      }
      const blogCount = (json.translated?.blog ?? []).length;
      const faqCount  = (json.translated?.faqs ?? []).length;
      setState("done");
      setInfo(`${blogCount} post(s) + ${faqCount} FAQ(s) traduzidos.`);
    } catch {
      setState("error");
      setInfo("Falha na ligação. Tente novamente.");
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="grid place-items-center w-9 h-9 rounded-full bg-navy-100 text-navy-700">
          <Languages className="w-5 h-5" />
        </span>
        <div>
          <p className="text-[14px] font-bold text-text-strong">Tradução automática</p>
          <p className="text-[12px] text-text-muted">Blog posts + FAQs → PT e FR via DeepL</p>
        </div>
      </div>

      <button
        onClick={run}
        disabled={state === "loading"}
        className="w-full flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold px-4 py-2.5 rounded-lg text-[13.5px] disabled:opacity-60 transition-colors"
      >
        {state === "loading" ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> A traduzir…</>
        ) : (
          <><Languages className="w-4 h-4" /> Traduzir todo o conteúdo</>
        )}
      </button>

      {state === "done" && (
        <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-success font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" /> {info}
        </p>
      )}
      {state === "error" && (
        <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-red-600 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" /> {info}
        </p>
      )}
    </div>
  );
}
