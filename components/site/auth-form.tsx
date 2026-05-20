"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function AuthForm({ mode, redirectTo }: { mode: Mode; redirectTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setInfo(null);
    try {
      const supabase = createSupabaseBrowser();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo:
              typeof window !== "undefined" ? `${window.location.origin}/entrar` : undefined,
          },
        });
        if (error) {
          setErrorMsg(error.message);
        } else if (data.session) {
          router.push(redirectTo ?? "/");
          router.refresh();
        } else {
          setInfo(
            "Cadastro recebido! Confirme o e-mail enviado para concluir e depois entre normalmente.",
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setErrorMsg("E-mail ou senha incorretos.");
        } else {
          router.push(redirectTo ?? "/");
          router.refresh();
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "signup" ? (
        <label className="block">
          <span className="text-[12.5px] font-semibold text-text-strong">Nome</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
            placeholder="Seu nome"
          />
        </label>
      ) : null}
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
      <label className="block">
        <span className="text-[12.5px] font-semibold text-text-strong">Senha</span>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
          placeholder="Mínimo 6 caracteres"
        />
      </label>
      {mode === "signin" ? (
        <div className="text-right -mt-2">
          <Link href="/esqueci-senha" className="text-[12.5px] text-navy-700 hover:underline">
            Esqueci minha senha
          </Link>
        </div>
      ) : null}

      {errorMsg ? <p className="text-[12.5px] text-red-600">{errorMsg}</p> : null}
      {info ? <p className="text-[12.5px] text-success">{info}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-4 py-3 rounded-xl text-[14.5px] flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {mode === "signup" ? "Criar conta" : "Entrar"}
      </button>

      <p className="text-[13px] text-text-muted text-center">
        {mode === "signup" ? (
          <>
            Já tem conta?{" "}
            <Link href="/entrar" className="text-navy-700 font-semibold hover:underline">
              Entrar
            </Link>
          </>
        ) : (
          <>
            Ainda não tem conta?{" "}
            <Link href="/cadastrar" className="text-navy-700 font-semibold hover:underline">
              Cadastre-se
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
