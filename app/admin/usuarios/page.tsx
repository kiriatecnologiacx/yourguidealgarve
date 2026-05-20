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
