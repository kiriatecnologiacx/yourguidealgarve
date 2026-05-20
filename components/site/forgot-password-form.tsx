"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, redirectTo: `${siteUrl}/nova-senha` }),
      });
      if (!res.ok) throw new Error("Erro ao enviar");
      setSent(true);
    } catch {
      setError("Não foi possível enviar o e-mail. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-4 text-[13.5px]">
          <p className="font-semibold">E-mail enviado!</p>
          <p className="mt-1">Verifique a caixa de entrada de <strong>{email}</strong> e clique no link para redefinir a senha.</p>
          <p className="mt-2 text-[12px] text-green-700">Não recebeu? Verifique o spam ou tente novamente.</p>
        </div>
        <Link href="/entrar" className="block text-center text-[13.5px] text-navy-700 hover:underline">
          ← Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-[12.5px] font-semibold text-text-strong">E-mail</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
          placeholder="voce@email.com"
        />
      </label>
      {error ? <p className="text-[12.5px] text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-4 py-3 rounded-xl text-[14.5px] flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Enviar link de recuperação
      </button>
      <Link href="/entrar" className="block text-center text-[13px] text-text-muted hover:text-text-strong">
        ← Voltar ao login
      </Link>
    </form>
  );
}
