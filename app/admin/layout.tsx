import { AdminSidebar } from "@/components/admin/sidebar";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-surface-alt flex">
      <AdminSidebar email={user?.email ?? null} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
