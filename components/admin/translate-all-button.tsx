"use client";

import { useState } from "react";
import { Languages, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function TranslateAllButton() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [info, setInfo]   = useState<string>("");
  const [errs, setErrs]   = useState<string[]>([]);

  async function run() {
    setState("loading");
    setInfo("");
    setErrs([]);
    try {
      const res  = await fetch("/admin/translate-all");
      const json = await res.json();

      if (!res.ok) {
        setState("error");
        setInfo(json.error ?? "Erro desconhecido");
        return;
      }

      const t = json.translated ?? {};
      const tours = typeof t.tours === "number" ? t.tours : 0;
      const blog  = typeof t.blog  === "number" ? t.blog  : 0;
      const faqs  = typeof t.faqs  === "number" ? t.faqs  : 0;

      if (json.errors?.length) {
        setState("error");
        setErrs(json.errors);
        setInfo(`Concluído com erros — ${tours} passeios, ${blog} posts, ${faqs} FAQs traduzidos`);
      } else {
        setState("done");
        setInfo(`${tours} passeio(s) + ${blog} post(s) + ${faqs} FAQ(s) traduzidos com sucesso.`);
      }
    } catch (e) {
      setState("error");
      setInfo(`Falha na ligação: ${e instanceof Error ? e.message : String(e)}`);
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
          <p className="text-[12px] text-text-muted">Passeios + Blog + FAQs → PT-PT e FR via DeepL</p>
        </div>
      </div>

      <button
        onClick={run}
        disabled={state === "loading"}
        className="w-full flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold px-4 py-2.5 rounded-lg text-[13.5px] disabled:opacity-60 transition-colors"
      >
        {state === "loading" ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> A traduzir… (pode demorar 1-2 min)</>
        ) : (
          <><Languages className="w-4 h-4" /> Traduzir todo o conteúdo</>
        )}
      </button>

      {(state === "done" || (state === "error" && info)) && (
        <p className={`mt-2 flex items-start gap-1.5 text-[12.5px] font-medium ${state === "done" ? "text-success" : "text-amber-600"}`}>
          {state === "done"
            ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          {info}
        </p>
      )}
      {errs.length > 0 && (
        <ul className="mt-2 space-y-1">
          {errs.map((e, i) => (
            <li key={i} className="text-[11.5px] text-red-600 bg-red-50 px-2 py-1 rounded">{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
