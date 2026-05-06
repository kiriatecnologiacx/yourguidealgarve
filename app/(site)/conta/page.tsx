import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, LogOut, ShieldCheck } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ContaPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <section className="bg-surface-alt min-h-[60vh]">
      <div className="mx-auto max-w-[800px] px-5 py-10">
        <h1 className="font-display text-3xl font-extrabold text-text-strong">
          Olá, {user.user_metadata?.full_name || user.email?.split("@")[0]}
        </h1>
        <p className="text-[13.5px] text-text-muted">{user.email}</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/favoritos"
            className="bg-white border border-border-subtle rounded-2xl p-5 hover:shadow-md transition flex items-center gap-3"
          >
            <span className="grid place-items-center w-11 h-11 rounded-full bg-brand-orange/10 text-brand-orange">
              <Heart className="w-5 h-5" />
            </span>
            <div>
              <p className="font-semibold text-text-strong">Meus favoritos</p>
              <p className="text-[12.5px] text-text-muted">Passeios salvos para mais tarde</p>
            </div>
          </Link>

          {admin ? (
            <Link
              href="/admin"
              className="bg-white border border-border-subtle rounded-2xl p-5 hover:shadow-md transition flex items-center gap-3"
            >
              <span className="grid place-items-center w-11 h-11 rounded-full bg-navy-800 text-brand-yellow">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <p className="font-semibold text-text-strong">Painel administrativo</p>
                <p className="text-[12.5px] text-text-muted">Gerenciar passeios, blog, parceiros</p>
              </div>
            </Link>
          ) : null}

          <form
            action="/api/auth/signout"
            method="post"
            className="bg-white border border-border-subtle rounded-2xl p-5 hover:shadow-md transition flex items-center gap-3 cursor-pointer"
          >
            <button type="submit" className="flex items-center gap-3 w-full text-left">
              <span className="grid place-items-center w-11 h-11 rounded-full bg-text-muted/10 text-text-muted">
                <LogOut className="w-5 h-5" />
              </span>
              <div>
                <p className="font-semibold text-text-strong">Sair</p>
                <p className="text-[12.5px] text-text-muted">Encerrar sessão</p>
              </div>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
