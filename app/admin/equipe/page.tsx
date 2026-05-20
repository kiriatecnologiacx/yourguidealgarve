import { createSupabaseServer } from "@/lib/supabase/server";
import { Crown, Shield, Trash2 } from "lucide-react";
import { removeAdmin, updateAdminRole } from "./actions";
import { AddAdminForm } from "@/components/admin/add-admin-form";

export const dynamic = "force-dynamic";

export default async function EquipePage() {
  const supabase = await createSupabaseServer();
  const { data: { user: me } } = await supabase.auth.getUser();
  const { data: admins } = await supabase
    .from("admins")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="px-6 lg:px-10 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-text-strong">Equipe & Acessos</h1>
        <p className="text-[13.5px] text-text-muted mt-0.5">
          Gerencie quem tem acesso ao painel administrativo.
        </p>
      </div>

      {/* Add new admin */}
      <section className="bg-white border border-border-subtle rounded-2xl p-5 mb-6">
        <h2 className="text-[15px] font-bold text-text-strong mb-3">Adicionar acesso</h2>
        <AddAdminForm />
        <div className="mt-4 bg-surface-alt rounded-xl p-4 text-[12.5px] text-text-muted space-y-1.5">
          <p className="font-semibold text-text-strong">Como funciona:</p>
          <p>1. Preencha o e-mail e role e clique em "Adicionar".</p>
          <p>2. Crie o utilizador manualmente (ou use "Recuperar senha" para enviar um e-mail de definição de senha).</p>
          <p>3. O acesso fica ativo assim que a pessoa entrar com as credenciais.</p>
        </div>
      </section>

      {/* Current admins */}
      <section className="bg-white border border-border-subtle rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle">
          <h2 className="text-[15px] font-bold text-text-strong">Acessos ativos</h2>
        </div>
        {(admins ?? []).length === 0 ? (
          <p className="p-6 text-[13.5px] text-text-muted">Nenhum administrador cadastrado.</p>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {(admins ?? []).map((a) => (
              <li key={a.user_id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-navy-800 flex items-center justify-center shrink-0">
                  <span className="text-white text-[13px] font-bold">
                    {(a.name || a.email).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  {a.name ? <p className="text-[13.5px] font-semibold text-text-strong">{a.name}</p> : null}
                  <p className="text-[13px] text-text-muted truncate">{a.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`flex items-center gap-1 text-[11.5px] font-semibold px-2 py-1 rounded-full ${
                    a.role === "owner"
                      ? "bg-brand-yellow/30 text-navy-900"
                      : "bg-surface-alt text-text-muted"
                  }`}>
                    {a.role === "owner" ? <Crown className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                    {a.role === "owner" ? "Owner" : "Editor"}
                  </span>
                  {a.user_id !== me?.id ? (
                    <form action={removeAdmin.bind(null, a.user_id)}>
                      <button
                        type="submit"
                        className="grid place-items-center w-8 h-8 rounded-md text-text-muted hover:text-red-600 hover:bg-red-50"
                        title="Remover acesso"
                        onClick={(e) => {
                          if (!confirm(`Remover acesso de ${a.email}?`)) e.preventDefault();
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <span className="text-[11px] text-text-muted px-2">(você)</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Email templates */}
      <section className="mt-6 bg-white border border-border-subtle rounded-2xl p-5 space-y-4">
        <h2 className="text-[15px] font-bold text-text-strong">Templates de e-mail para enviar</h2>
        <p className="text-[12.5px] text-text-muted">
          Copie e envie estes modelos quando criar ou resetar o acesso de alguém.
        </p>

        <EmailTemplate
          title="Boas-vindas — novo acesso"
          body={`Olá,\n\nO seu acesso ao painel administrativo do Your Guide Algarve foi criado.\n\nAcesse em: https://yourguidealgarve.vercel.app/admin/login\n\nE-mail: [EMAIL DO UTILIZADOR]\nSenha:  [SENHA CRIADA]\n\nRecomendamos que altere a senha após o primeiro acesso em:\nhttps://yourguidealgarve.vercel.app/admin/login/recuperar\n\nQualquer dúvida, responda este e-mail.\n\nEquipa Your Guide Algarve`}
        />

        <EmailTemplate
          title="Redefinição de senha"
          body={`Olá,\n\nA sua senha de acesso ao painel do Your Guide Algarve foi redefinida.\n\nAcesse em: https://yourguidealgarve.vercel.app/admin/login\n\nE-mail: [EMAIL DO UTILIZADOR]\nNova senha: [NOVA SENHA]\n\nSe não solicitou esta alteração, entre em contacto connosco imediatamente.\n\nEquipa Your Guide Algarve`}
        />
      </section>
    </div>
  );
}

function EmailTemplate({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border-subtle overflow-hidden">
      <div className="bg-surface-alt px-4 py-2.5 flex items-center justify-between">
        <p className="text-[13px] font-semibold text-text-strong">{title}</p>
      </div>
      <pre className="px-4 py-3 text-[12px] text-text-strong/85 leading-relaxed whitespace-pre-wrap font-mono bg-white">
        {body}
      </pre>
    </div>
  );
}
