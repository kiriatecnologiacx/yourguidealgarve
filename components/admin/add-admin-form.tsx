"use client";

import { useActionState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { inviteAdmin, type TeamFormState } from "@/app/admin/equipe/actions";

const initial: TeamFormState = {};
const fc = "w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 bg-white";

export function AddAdminForm() {
  const [state, action, pending] = useActionState(inviteAdmin, initial);

  if (state.success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 text-[13px] px-4 py-3 rounded-lg">
        {state.success}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input name="name" placeholder="Nome (opcional)" className={fc} />
        <input name="email" type="email" required placeholder="email@exemplo.com" className={fc} />
        <select name="role" className={fc}>
          <option value="editor">Editor — pode criar/editar</option>
          <option value="owner">Owner — acesso total</option>
        </select>
      </div>
      {state.error ? (
        <p className="text-[12.5px] text-red-600">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-navy-800 hover:bg-navy-900 text-white font-semibold px-4 py-2.5 rounded-lg text-[13.5px] flex items-center gap-2 disabled:opacity-60"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
        Adicionar
      </button>
    </form>
  );
}
