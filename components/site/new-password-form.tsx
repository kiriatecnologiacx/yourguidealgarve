"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export function SiteNewPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("A senha deve ter pelo menos 8 caracteres."); return; }
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError("Não foi possível redefinir a senha. O link pode ter expirado.");
      } else {
        setDone(true);
        setTimeout(() => router.push("/"), 2000);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-4 text-[13.5px]">
        <p className="font-semibold">Senha redefinida!</p>
        <p className="mt-1">Redirecionando…</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-[12.5px] font-semibold text-text-strong">Nova senha</span>
        <div className="mt-1 relative">
          <input
            type={show ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border-subtle px-3 py-2.5 pr-10 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
            placeholder="Mínimo 8 caracteres"
          />
          <button type="button" onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-strong">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </label>
      <label className="block">
        <span className="text-[12.5px] font-semibold text-text-strong">Confirmar senha</span>
        <input
          type={show ? "text" : "password"}
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
          placeholder="Repita a nova senha"
        />
      </label>
      {error ? <p className="text-[12.5px] text-red-600">{error}</p> : null}
      <button type="submit" disabled={submitting}
        className="w-full bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-4 py-3 rounded-xl text-[14.5px] flex items-center justify-center gap-2 disabled:opacity-60">
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Salvar nova senha
      </button>
    </form>
  );
}
