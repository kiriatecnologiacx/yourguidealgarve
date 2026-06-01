"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { t, type Locale } from "@/lib/i18n";

type Mode = "signin" | "signup";

export function AuthForm({ mode, redirectTo, locale }: { mode: Mode; redirectTo?: string; locale: Locale }) {
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
          setInfo(t(locale, "auth.signUpSuccess"));
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setErrorMsg(t(locale, "auth.wrongCredentials"));
        } else {
          router.push(redirectTo ?? "/");
          router.refresh();
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  const ic = "mt-1 w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "signup" ? (
        <label className="block">
          <span className="text-[12.5px] font-semibold text-text-strong">{t(locale, "auth.name")}</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={ic} placeholder={t(locale, "auth.namePlaceholder")} />
        </label>
      ) : null}
      <label className="block">
        <span className="text-[12.5px] font-semibold text-text-strong">{t(locale, "auth.email")}</span>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={ic} placeholder={t(locale, "auth.emailPlaceholder")} />
      </label>
      <label className="block">
        <span className="text-[12.5px] font-semibold text-text-strong">{t(locale, "auth.password")}</span>
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={ic} placeholder={t(locale, "auth.passwordPlaceholder")} />
      </label>
      {mode === "signin" ? (
        <div className="text-right -mt-2">
          <Link href="/esqueci-senha" className="text-[12.5px] text-navy-700 hover:underline">
            {t(locale, "auth.forgotPassword")}
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
        {mode === "signup" ? t(locale, "auth.createAccount") : t(locale, "auth.signIn")}
      </button>

      <p className="text-[13px] text-text-muted text-center">
        {mode === "signup" ? (
          <>
            {t(locale, "auth.hasAccount")}{" "}
            <Link href="/entrar" className="text-navy-700 font-semibold hover:underline">
              {t(locale, "auth.signIn")}
            </Link>
          </>
        ) : (
          <>
            {t(locale, "auth.noAccount")}{" "}
            <Link href="/cadastrar" className="text-navy-700 font-semibold hover:underline">
              {t(locale, "auth.register")}
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
