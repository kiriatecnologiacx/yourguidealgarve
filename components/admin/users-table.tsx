"use client";

import { useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle text-[12px] text-text-strong hover:bg-surface-alt hover:border-navy-300 disabled:opacity-60 transition-colors"
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
