"use client";

import { useActionState, useState } from "react";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import { upsertFaq, deleteFaq } from "@/app/admin/faq/actions";

type Faq = { id: string; question: string; answer: string; position: number; is_published: boolean };

const fc = "w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 bg-white";

export function FaqManager({ faqs }: { faqs: Faq[] }) {
  const [editing, setEditing] = useState<Faq | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [state, action, pending] = useActionState(upsertFaq, null);

  function startEdit(faq: Faq) {
    setEditing(faq);
    setShowForm(true);
  }

  function startNew() {
    setEditing(null);
    setShowForm(true);
  }

  function cancel() {
    setEditing(null);
    setShowForm(false);
  }

  return (
    <div className="mt-6 space-y-6">
      {/* FAQ list */}
      {faqs.length > 0 ? (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-2xl border border-border-subtle p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-text-strong leading-snug">{faq.question}</p>
                  <p className="text-[13px] text-text-muted mt-1 line-clamp-2">{faq.answer}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${faq.is_published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {faq.is_published ? "publicada" : "rascunho"}
                    </span>
                    <span className="text-[11px] text-text-muted">pos. {faq.position}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(faq)}
                    className="flex items-center gap-1.5 text-[12.5px] font-semibold text-navy-700 hover:text-navy-900 bg-surface-alt hover:bg-navy-50 px-3 py-1.5 rounded-lg border border-border-subtle"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Editar
                  </button>
                  <form action={deleteFaq.bind(null, faq.id)}>
                    <button type="submit" className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 text-red-500 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[13.5px] text-text-muted">Nenhuma pergunta ainda. Clique em "+ Adicionar" para começar.</p>
      )}

      {/* Form */}
      {showForm ? (
        <form action={action} className="bg-white rounded-2xl border border-border-subtle p-5 space-y-4">
          <h2 className="text-[15px] font-bold text-text-strong">
            {editing ? "Editar pergunta" : "Nova pergunta"}
          </h2>
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

          <div>
            <label className="block text-[12.5px] font-semibold text-text-strong mb-1">Pergunta *</label>
            <input name="question" required defaultValue={editing?.question ?? ""} className={fc} placeholder="Ex: É preciso reservar com antecedência?" />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-text-strong mb-1">Resposta *</label>
            <textarea name="answer" required defaultValue={editing?.answer ?? ""} rows={5} className={fc} placeholder="Escreva a resposta completa aqui..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-text-strong mb-1">Posição (ordem)</label>
              <input name="position" type="number" defaultValue={editing?.position ?? faqs.length} className={fc} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_published" defaultChecked={editing?.is_published ?? true} className="w-4 h-4 rounded accent-navy-800" />
                <span className="text-[13.5px] text-text-strong">Publicada</span>
              </label>
            </div>
          </div>

          {state?.error ? (
            <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{state.error}</p>
          ) : null}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={pending} className="flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-4 py-2.5 rounded-lg text-[13.5px] disabled:opacity-60">
              <Save className="w-4 h-4" /> Guardar
            </button>
            <button type="button" onClick={cancel} className="flex items-center gap-2 text-[13.5px] text-text-muted hover:text-text-strong px-3 py-2.5">
              <X className="w-4 h-4" /> Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={startNew}
          className="flex items-center gap-2 bg-white border border-border-subtle hover:bg-surface-alt text-text-strong font-semibold px-4 py-2.5 rounded-lg text-[13.5px]"
        >
          <Plus className="w-4 h-4" /> Adicionar pergunta
        </button>
      )}
    </div>
  );
}
