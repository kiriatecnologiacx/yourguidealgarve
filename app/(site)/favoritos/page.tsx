import Link from "next/link";
import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
import { TourCard } from "@/components/site/tour-card";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import type { Tour } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function FavoritosPage() {
  const supabase = await createSupabaseServer();
  const [{ data: { user } }, locale] = await Promise.all([
    supabase.auth.getUser(),
    getLocale(),
  ]);
  if (!user) redirect("/entrar?next=/favoritos");

  const { data } = await supabase
    .from("favorites")
    .select("tour:tours(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as unknown as { tour: Tour | Tour[] | null }[];
  const tours = rows
    .flatMap((r) => (Array.isArray(r.tour) ? r.tour : r.tour ? [r.tour] : []))
    .filter((t) => t?.is_published);

  const countLabel = `${tours.length} ${tours.length === 1 ? t(locale, "page.favorites.tour") : t(locale, "page.favorites.tours")} ${t(locale, "page.favorites.saved")}`;

  return (
    <section className="bg-surface-alt min-h-[60vh]">
      <div className="mx-auto max-w-[1240px] px-5 py-10">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-brand-orange fill-brand-orange" />
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-text-strong">
            {t(locale, "page.favorites.title")}
          </h1>
        </div>
        <p className="text-[13.5px] text-text-muted mt-1">{countLabel}</p>

        {tours.length === 0 ? (
          <div className="mt-8 bg-white rounded-2xl border border-border-subtle p-10 text-center">
            <p className="text-[15px] font-semibold text-text-strong">
              {t(locale, "page.favorites.empty")}
            </p>
            <p className="text-[13px] text-text-muted mt-1">
              {t(locale, "page.favorites.emptyHint")}
            </p>
            <Link
              href="/atividades"
              className="mt-4 inline-flex bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-4 py-2.5 rounded-lg text-[13.5px]"
            >
              {t(locale, "page.favorites.explore")}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} locale={locale} isAuthed={true} isFavorite={true} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
