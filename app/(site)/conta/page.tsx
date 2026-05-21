import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Heart, LogOut, ShieldCheck } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getLocale } from "@/lib/locale-server";
import type { Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const COPY: Record<Locale, Record<string, string>> = {
  "en": {
    "hello":          "Hello",
    "fav.title":      "Favorites",
    "fav.sub":        "Tours you saved for later",
    "book.title":     "My bookings",
    "book.sub":       "Bookings happen on the partner site — check your email confirmation",
    "admin.title":    "Admin panel",
    "admin.sub":      "Manage tours, blog and partners",
    "logout.title":   "Sign out",
    "logout.sub":     "End session",
  },
  "fr": {
    "hello":          "Bonjour",
    "fav.title":      "Mes favoris",
    "fav.sub":        "Activités sauvegardées pour plus tard",
    "book.title":     "Mes réservations",
    "book.sub":       "Les réservations se font sur le site du partenaire — vérifiez votre e-mail de confirmation",
    "admin.title":    "Panneau d'administration",
    "admin.sub":      "Gérer les tours, le blog et les partenaires",
    "logout.title":   "Se déconnecter",
    "logout.sub":     "Terminer la session",
  },
  "pt-PT": {
    "hello":          "Olá",
    "fav.title":      "Os meus favoritos",
    "fav.sub":        "Passeios guardados para depois",
    "book.title":     "As minhas reservas",
    "book.sub":       "As reservas são feitas no site do parceiro — verifique o seu e-mail de confirmação",
    "admin.title":    "Painel administrativo",
    "admin.sub":      "Gerir passeios, blog e parceiros",
    "logout.title":   "Sair",
    "logout.sub":     "Encerrar sessão",
  },
};

function tt(locale: Locale, key: string) {
  return COPY[locale]?.[key] ?? COPY["en"][key] ?? key;
}

export default async function ContaPage() {
  const supabase = await createSupabaseServer();
  const locale = await getLocale();
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
          {tt(locale, "hello")}, {user.user_metadata?.full_name || user.email?.split("@")[0]}
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
              <p className="font-semibold text-text-strong">{tt(locale, "fav.title")}</p>
              <p className="text-[12.5px] text-text-muted">{tt(locale, "fav.sub")}</p>
            </div>
          </Link>

          <div className="bg-white border border-border-subtle rounded-2xl p-5 flex items-center gap-3 opacity-95">
            <span className="grid place-items-center w-11 h-11 rounded-full bg-brand-yellow-soft text-navy-700">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <p className="font-semibold text-text-strong">{tt(locale, "book.title")}</p>
              <p className="text-[12.5px] text-text-muted">{tt(locale, "book.sub")}</p>
            </div>
          </div>

          {admin ? (
            <Link
              href="/admin"
              className="bg-white border border-border-subtle rounded-2xl p-5 hover:shadow-md transition flex items-center gap-3"
            >
              <span className="grid place-items-center w-11 h-11 rounded-full bg-navy-800 text-brand-yellow">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <p className="font-semibold text-text-strong">{tt(locale, "admin.title")}</p>
                <p className="text-[12.5px] text-text-muted">{tt(locale, "admin.sub")}</p>
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
                <p className="font-semibold text-text-strong">{tt(locale, "logout.title")}</p>
                <p className="text-[12.5px] text-text-muted">{tt(locale, "logout.sub")}</p>
              </div>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
