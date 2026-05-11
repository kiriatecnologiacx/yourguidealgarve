import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const isLoginRoute = pathname.startsWith("/admin/login");

  if (isLoginRoute) {
    return <>{children}</>;
  }

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: admin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!admin) {
      redirect("/conta?msg=admin-only");
    }
  }

  return (
    <div className="min-h-screen bg-surface-alt flex">
      <AdminSidebar email={user?.email ?? null} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
