"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export function LoginForm({ next, error }: { next?: string; error?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(error ?? null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMsg("E-mail ou senha incorretos.");
      } else {
        router.push(next ?? "/admin");
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
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
          placeholder="voce@empresa.com"
        />
      </label>
      <label className="block">
        <span className="text-[12.5px] font-semibold text-text-strong">Senha</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
          placeholder="••••••••"
        />
      </label>
      {errorMsg ? (
        <p className="text-[12.5px] text-red-600">{errorMsg}</p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-4 py-3 rounded-xl text-[14.5px] flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : null}
        Entrar
      </button>
      <div className="flex justify-between items-center text-[12px]">
        <p className="text-text-muted">Acesso restrito a administradores.</p>
        <a href="/admin/login/recuperar" className="text-navy-700 hover:underline font-medium">
          Esqueceu a senha?
        </a>
      </div>
    </form>
  );
}
