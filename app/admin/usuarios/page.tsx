import { Users, AlertTriangle } from "lucide-react";
import { listUsers } from "./actions";
import { UsersTable } from "@/components/admin/users-table";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  let users: Awaited<ReturnType<typeof listUsers>> = [];
  let configError = false;

  try {
    users = await listUsers();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      configError = true;
    }
  }

  return (
    <div className="px-6 lg:px-10 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-5 h-5 text-text-muted" />
        <div>
          <h1 className="text-2xl font-extrabold text-text-strong">Usuários</h1>
          {!configError && (
            <p className="text-[13px] text-text-muted">
              {users.length} conta{users.length !== 1 ? "s" : ""} cadastrada{users.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {configError ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] font-semibold text-amber-900">
              Configuração necessária
            </p>
            <p className="text-[13px] text-amber-800 mt-1">
              Para gerir utilizadores, é necessário adicionar a variável{" "}
              <code className="bg-amber-100 px-1 rounded font-mono text-[12px]">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
              nas definições do Vercel.
            </p>
            <p className="text-[12.5px] text-amber-700 mt-2">
              Vai a{" "}
              <a
                href="https://supabase.com/dashboard/project/wyligoajwjiveqrwiolz/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                Supabase → Settings → API
              </a>{" "}
              e copia a chave <strong>service_role</strong>. Depois adiciona no Vercel em{" "}
              <strong>Settings → Environment Variables</strong>.
            </p>
          </div>
        </div>
      ) : (
        <UsersTable users={users} />
      )}
    </div>
  );
}
