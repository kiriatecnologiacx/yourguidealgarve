import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, ExternalLink } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";
import { formatPriceBRL, formatRating } from "@/lib/utils";
import { TourRowActions } from "@/components/admin/tour-row-actions";
import { RezdyImportButton } from "@/components/admin/rezdy-import-button";

export const dynamic = "force-dynamic";

export default async function AdminPasseiosPage() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("tours")
    .select(
      "id, slug, title, cover_image, price_brl, price_from_brl, rating, reviews_count, is_published, is_featured, affiliate_url, badge, destination:destinations(name)",
    )
    .order("created_at", { ascending: false });

  const tours = data ?? [];

  return (
    <div className="px-6 lg:px-10 py-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-text-strong">Passeios</h1>
          <p className="text-[13.5px] text-text-muted">
            {tours.length} passeio{tours.length === 1 ? "" : "s"} cadastrado
            {tours.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <RezdyImportButton />
          <Link
            href="/admin/passeios/novo"
            className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-4 py-2.5 rounded-lg text-[13.5px] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Novo passeio
          </Link>
        </div>
      </div>

      <div className="mt-6 bg-white border border-border-subtle rounded-2xl overflow-hidden">
        {tours.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[15px] font-semibold text-text-strong">
              Nenhum passeio cadastrado ainda
            </p>
            <p className="text-[13.5px] text-text-muted mt-1">
              Comece adicionando o primeiro passeio.
            </p>
            <Link
              href="/admin/passeios/novo"
              className="mt-4 inline-flex bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-4 py-2.5 rounded-lg text-[13.5px] items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Adicionar passeio
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-surface-alt border-b border-border-subtle text-[12px] uppercase tracking-wide text-text-muted">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Passeio</th>
                <th className="text-left px-5 py-3 font-semibold">Destino</th>
                <th className="text-left px-5 py-3 font-semibold">Preço</th>
                <th className="text-left px-5 py-3 font-semibold">Avaliação</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-right px-5 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {tours.map((t) => {
                const destination = (
                  t as unknown as { destination: { name: string } | null }
                ).destination;
                return (
                  <tr key={t.id} className="hover:bg-surface-alt">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-alt">
                          {t.cover_image ? (
                            <Image
                              src={t.cover_image}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13.5px] font-semibold text-text-strong line-clamp-1">
                            {t.title}
                          </p>
                          <p className="text-[12px] text-text-muted line-clamp-1">
                            /{t.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-text-strong">
                      {destination?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-[13px] text-text-strong">
                      {formatPriceBRL(t.price_from_brl ?? t.price_brl)}
                    </td>
                    <td className="px-5 py-3 text-[13px] text-text-strong">
                      ★ {formatRating(t.rating)}{" "}
                      <span className="text-text-muted">({t.reviews_count})</span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[11.5px] font-semibold px-2 py-1 rounded-full ${
                          t.is_published
                            ? "bg-success/10 text-success"
                            : "bg-text-muted/10 text-text-muted"
                        }`}
                      >
                        {t.is_published ? "Publicado" : "Rascunho"}
                      </span>
                      {t.is_featured ? (
                        <span className="ml-1 text-[11.5px] font-semibold px-2 py-1 rounded-full bg-brand-yellow-soft text-navy-700">
                          Destaque
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={t.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="grid place-items-center w-8 h-8 rounded-md text-text-muted hover:text-text-strong hover:bg-surface-alt"
                          title="Abrir link de afiliado"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <Link
                          href={`/admin/passeios/${t.id}`}
                          className="grid place-items-center w-8 h-8 rounded-md text-text-muted hover:text-text-strong hover:bg-surface-alt"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <TourRowActions id={t.id} isPublished={t.is_published} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
