# Recuperação de Senha — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar recuperação de senha para usuários regulares (link no login → email via Resend) e para o admin gerenciar senhas de usuários (listar usuários + botão resetar).

**Architecture:** Uma API route `/api/auth/reset-password` usa o Supabase Admin client (service role key) para gerar um link de recovery e envia via Resend. O admin vê a lista de usuários em `/admin/usuarios` e pode disparar o reset. Usuários regulares têm link "Esqueci a senha" na tela de login levando a `/esqueci-senha`.

**Tech Stack:** Next.js 15, Resend SDK, Supabase Admin API (service role), TypeScript

---

### Task 1: Instalar Resend e configurar env vars

**Files:**
- Modify: `package.json`
- Modify: `.env.local`
- Vercel: adicionar env vars via MCP ou dashboard

- [ ] **Step 1: Instalar SDK do Resend**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && npm install resend
```

- [ ] **Step 2: Adicionar env vars ao .env.local**

Adicionar ao final de `.env.local`:
```
RESEND_API_KEY=re_cdHiEn7D_N5N3MW1NVb9M3j84tNPjiL7k
SUPABASE_SERVICE_ROLE_KEY=<pegar no Supabase dashboard: Settings > API > service_role key>
```

- [ ] **Step 3: Adicionar env vars ao Vercel (produção)**

Via Vercel MCP ou dashboard — adicionar as mesmas variáveis ao projeto `yourguidealgarve` (team_JIuD6Bnrp0wAtQ1cpLtQPi7m, prj_TQBEFA20Q59EQQSurD3CvHPGSnxK) para os ambientes production e preview.

- [ ] **Step 4: Commit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git add package.json package-lock.json && git commit -m "feat: instalar resend para emails transacionais"
```

---

### Task 2: Supabase Admin client

**Files:**
- Create: `lib/supabase/admin.ts`

- [ ] **Step 1: Criar cliente admin do Supabase**

Criar `lib/supabase/admin.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada");
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git add lib/supabase/admin.ts && git commit -m "feat: Supabase admin client com service role"
```

---

### Task 3: API route de reset de senha

**Files:**
- Create: `app/api/auth/reset-password/route.ts`

- [ ] **Step 1: Criar a API route**

Criar `app/api/auth/reset-password/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServer } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email, redirectTo } = await req.json() as { email?: string; redirectTo?: string };

  if (!email) {
    return NextResponse.json({ error: "E-mail obrigatório" }, { status: 400 });
  }

  try {
    const supabaseAdmin = createSupabaseAdmin();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://youguidealgarve.vercel.app";
    const destination = redirectTo ?? `${siteUrl}/nova-senha`;

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: destination },
    });

    if (linkError || !linkData?.properties?.action_link) {
      // Não revelar se o e-mail existe ou não
      return NextResponse.json({ ok: true });
    }

    const resetLink = linkData.properties.action_link;

    await resend.emails.send({
      from: "Your Guide Algarve <noreply@yourguidealgarve.com>",
      to: email,
      subject: "Recuperação de senha — Your Guide Algarve",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
          <h1 style="font-size:22px;font-weight:800;color:#0a2540;margin-bottom:8px">
            Recuperação de senha
          </h1>
          <p style="font-size:15px;color:#4b5563;line-height:1.6">
            Recebemos um pedido para redefinir a senha da sua conta no 
            <strong>Your Guide Algarve</strong>.
          </p>
          <p style="font-size:15px;color:#4b5563;line-height:1.6">
            Clique no botão abaixo para criar uma nova senha. O link expira em 1 hora.
          </p>
          <div style="text-align:center;margin:32px 0">
            <a href="${resetLink}"
               style="background:#f5c518;color:#0a2540;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;display:inline-block">
              Redefinir senha
            </a>
          </div>
          <p style="font-size:12px;color:#9ca3af;line-height:1.6">
            Se você não solicitou a recuperação de senha, ignore este e-mail. Sua senha permanece a mesma.
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
          <p style="font-size:12px;color:#9ca3af">
            Your Guide Algarve · Algarve, Portugal
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json({ ok: true }); // não vazar erros internos
  }
}
```

**Nota:** O domínio `yourguidealgarve.com` precisa estar verificado no painel do Resend para enviar emails. Enquanto não estiver, usar `onboarding@resend.dev` como remetente temporário.

- [ ] **Step 2: Commit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git add app/api/auth/reset-password/route.ts && git commit -m "feat: API route de reset de senha com Resend"
```

---

### Task 4: Recuperação de senha para usuários regulares

**Files:**
- Modify: `components/site/auth-form.tsx`
- Create: `app/(site)/esqueci-senha/page.tsx`
- Create: `app/(site)/nova-senha/page.tsx`
- Create: `components/site/forgot-password-form.tsx`
- Create: `components/site/new-password-form.tsx`

- [ ] **Step 1: Adicionar link "Esqueci a senha" no AuthForm**

Em `components/site/auth-form.tsx`, após o campo de senha (modo `signin`), adicionar:

```typescript
{mode === "signin" ? (
  <div className="text-right -mt-2">
    <Link href="/esqueci-senha" className="text-[12.5px] text-navy-700 hover:underline">
      Esqueci minha senha
    </Link>
  </div>
) : null}
```

- [ ] **Step 2: Criar formulário de esqueci a senha**

Criar `components/site/forgot-password-form.tsx`:

```typescript
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
```

- [ ] **Step 3: Criar página /esqueci-senha**

Criar `app/(site)/esqueci-senha/page.tsx`:

```typescript
import { ForgotPasswordForm } from "@/components/site/forgot-password-form";

export default function EsqueciSenhaPage() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-[24px] font-extrabold text-text-strong">Recuperar senha</h1>
        <p className="text-[13.5px] text-text-muted mt-1">
          Informe o seu e-mail e receberá um link para redefinir a senha.
        </p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Criar componente nova-senha para usuários**

Criar `components/site/new-password-form.tsx`:

```typescript
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
```

- [ ] **Step 5: Criar página /nova-senha**

Criar `app/(site)/nova-senha/page.tsx`:

```typescript
import { SiteNewPasswordForm } from "@/components/site/new-password-form";

export default function NovaSenhaPage() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-[24px] font-extrabold text-text-strong">Nova senha</h1>
        <p className="text-[13.5px] text-text-muted mt-1">Escolha uma senha forte para a sua conta.</p>
        <div className="mt-6">
          <SiteNewPasswordForm />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git add components/site/forgot-password-form.tsx components/site/new-password-form.tsx app/(site)/esqueci-senha/page.tsx app/(site)/nova-senha/page.tsx components/site/auth-form.tsx && git commit -m "feat: recuperação de senha para usuários regulares"
```

---

### Task 5: Atualizar o admin reset para usar Resend

**Files:**
- Modify: `components/admin/reset-request-form.tsx`

- [ ] **Step 1: Atualizar o form do admin para usar a API route**

O `ResetRequestForm` existente usa `supabase.auth.resetPasswordForEmail` (email do Supabase). Atualizar para usar nossa API route com Resend:

Substituir o conteúdo de `components/admin/reset-request-form.tsx`:

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function ResetRequestForm() {
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
        body: JSON.stringify({ email, redirectTo: `${siteUrl}/admin/login/nova-senha` }),
      });
      if (!res.ok) throw new Error("Erro ao enviar");
      setSent(true);
    } catch {
      setError("Não foi possível enviar o e-mail. Verifique o endereço e tente novamente.");
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
        <Link href="/admin/login" className="block text-center text-[13.5px] text-navy-700 hover:underline">
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
          placeholder="voce@empresa.com"
        />
      </label>
      {error ? <p className="text-[12.5px] text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-navy-800 hover:bg-navy-900 text-white font-bold px-4 py-3 rounded-xl text-[14.5px] flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Enviar link de recuperação
      </button>
      <Link href="/admin/login" className="block text-center text-[13px] text-text-muted hover:text-text-strong">
        ← Voltar ao login
      </Link>
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git add components/admin/reset-request-form.tsx && git commit -m "feat: admin reset de senha usa Resend em vez de Supabase email"
```

---

### Task 6: Admin — Gerenciar usuários com reset de senha

**Files:**
- Create: `app/admin/usuarios/page.tsx`
- Create: `app/admin/usuarios/actions.ts`

- [ ] **Step 1: Criar actions de usuários para admin**

Criar `app/admin/usuarios/actions.ts`:

```typescript
"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");
  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!data) throw new Error("Não autorizado");
  return user;
}

export type AppUser = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
};

export async function listUsers(): Promise<AppUser[]> {
  await requireAdmin();
  const supabaseAdmin = createSupabaseAdmin();
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw error;
  return (data.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "",
    full_name: (u.user_metadata?.full_name as string | undefined) ?? null,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
  }));
}

export async function sendPasswordResetToUser(email: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://youguidealgarve.vercel.app";
    const res = await fetch(`${siteUrl}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, redirectTo: `${siteUrl}/nova-senha` }),
    });
    if (!res.ok) return { ok: false, error: "Erro ao enviar e-mail" };
    return { ok: true };
  } catch {
    return { ok: false, error: "Erro ao enviar e-mail" };
  }
}
```

- [ ] **Step 2: Criar a página de usuários no admin**

Criar `app/admin/usuarios/page.tsx`:

```typescript
import { Suspense } from "react";
import { Users } from "lucide-react";
import { listUsers } from "./actions";
import { UsersTable } from "@/components/admin/users-table";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  const users = await listUsers();

  return (
    <div className="px-6 lg:px-10 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-5 h-5 text-text-muted" />
        <div>
          <h1 className="text-2xl font-extrabold text-text-strong">Usuários</h1>
          <p className="text-[13px] text-text-muted">{users.length} conta{users.length !== 1 ? "s" : ""} cadastrada{users.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
```

- [ ] **Step 3: Criar componente UsersTable**

Criar `components/admin/users-table.tsx`:

```typescript
"use client";

import { useState } from "react";
import { Loader2, Mail, RotateCcw } from "lucide-react";
import type { AppUser } from "@/app/admin/usuarios/actions";
import { sendPasswordResetToUser } from "@/app/admin/usuarios/actions";

export function UsersTable({ users }: { users: AppUser[] }) {
  const [sending, setSending] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});

  async function handleReset(email: string) {
    setSending(email);
    setMessages((m) => ({ ...m, [email]: "" }));
    const result = await sendPasswordResetToUser(email);
    setMessages((m) => ({
      ...m,
      [email]: result.ok ? "E-mail enviado!" : (result.error ?? "Erro"),
    }));
    setSending(null);
  }

  if (users.length === 0) {
    return (
      <div className="bg-white border border-border-subtle rounded-2xl p-8 text-center text-[14px] text-text-muted">
        Nenhum usuário cadastrado ainda.
      </div>
    );
  }

  return (
    <div className="bg-white border border-border-subtle rounded-2xl overflow-hidden">
      <table className="w-full text-[13.5px]">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-alt">
            <th className="text-left px-4 py-3 font-semibold text-text-muted">Nome</th>
            <th className="text-left px-4 py-3 font-semibold text-text-muted">E-mail</th>
            <th className="text-left px-4 py-3 font-semibold text-text-muted">Cadastro</th>
            <th className="text-left px-4 py-3 font-semibold text-text-muted">Último acesso</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-alt/50">
              <td className="px-4 py-3 font-medium text-text-strong">
                {user.full_name ?? <span className="text-text-muted italic">—</span>}
              </td>
              <td className="px-4 py-3 text-text-muted">{user.email}</td>
              <td className="px-4 py-3 text-text-muted">
                {new Date(user.created_at).toLocaleDateString("pt-BR")}
              </td>
              <td className="px-4 py-3 text-text-muted">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleDateString("pt-BR")
                  : <span className="italic">Nunca</span>}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 justify-end">
                  {messages[user.email] ? (
                    <span className={`text-[12px] ${messages[user.email] === "E-mail enviado!" ? "text-green-600" : "text-red-600"}`}>
                      {messages[user.email]}
                    </span>
                  ) : null}
                  <button
                    onClick={() => handleReset(user.email)}
                    disabled={sending === user.email}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle text-[12px] text-text-strong hover:bg-navy-50 hover:border-navy-300 disabled:opacity-60 transition-colors"
                    title="Enviar e-mail de reset de senha"
                  >
                    {sending === user.email
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <RotateCcw className="w-3 h-3" />}
                    Resetar senha
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Adicionar link no menu do admin**

No layout do admin (verificar arquivo de navegação), adicionar link para `/admin/usuarios`.

- [ ] **Step 5: Commit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git add app/admin/usuarios/ components/admin/users-table.tsx && git commit -m "feat: admin de usuários com reset de senha"
```

---

### Task 7: Deploy

- [ ] **Step 1: Configurar SUPABASE_SERVICE_ROLE_KEY no Vercel**

Antes do deploy, garantir que `SUPABASE_SERVICE_ROLE_KEY` e `RESEND_API_KEY` estão configuradas no Vercel (production e preview).

- [ ] **Step 2: Push para main**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git push origin main
```

Vercel faz deploy automático.
