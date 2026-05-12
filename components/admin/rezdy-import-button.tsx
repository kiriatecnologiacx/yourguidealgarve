"use client";

import { useState, useTransition } from "react";
import { Download, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { importFromRezdy, type RezdyImportResult } from "@/app/admin/passeios/actions";

export function RezdyImportButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<RezdyImportResult | null>(null);

  function run() {
    setResult(null);
    startTransition(async () => {
      const r = await importFromRezdy();
      setResult(r);
    });
  }

  return (
    <div className="flex items-start gap-3 flex-wrap">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="bg-white border border-border-subtle hover:bg-surface-alt text-text-strong font-semibold px-4 py-2.5 rounded-lg text-[13.5px] flex items-center gap-2 disabled:opacity-60"
        title="Importar todos os passeios da sua conta Rezdy"
      >
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {pending ? "Importando..." : "Importar do Rezdy"}
      </button>

      {result ? (
        result.ok ? (
          <div className="flex items-center gap-2 text-[13px] bg-success/10 text-success border border-success/20 px-3 py-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              <strong>{result.created ?? 0}</strong> criados,{" "}
              <strong>{result.updated ?? 0}</strong> atualizados
              {result.skipped ? `, ${result.skipped} ignorados` : ""}
              {typeof result.totalFromRezdy === "number"
                ? ` — ${result.totalFromRezdy} encontrados no Rezdy`
                : ""}
            </span>
          </div>
        ) : (
          <div className="flex items-start gap-2 text-[13px] bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-lg max-w-xl">
            <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{result.error}</span>
          </div>
        )
      ) : null}
    </div>
  );
}
