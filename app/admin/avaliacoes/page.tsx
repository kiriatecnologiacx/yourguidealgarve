import { createSupabaseServer } from "@/lib/supabase/server";
import { Star } from "lucide-react";
import { approveReview, deleteReview } from "./actions";

export const dynamic = "force-dynamic";

export default async function AvaliacoesAdminPage() {
  const supabase = await createSupabaseServer();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, tour:tours(title, slug)")
    .order("created_at", { ascending: false });

  const pending = (reviews ?? []).filter((r) => !r.approved);
  const approved = (reviews ?? []).filter((r) => r.approved);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[22px] font-extrabold text-text-strong">Avaliações</h1>
        <p className="text-[13px] text-text-muted mt-1">
          Aprove ou exclua avaliações enviadas pelos visitantes.
        </p>
      </div>

      {pending.length > 0 && (
        <div>
          <h2 className="text-[15px] font-bold text-text-strong mb-3">
            Aguardando aprovação ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((r) => (
              <ReviewRow key={r.id} review={r} />
            ))}
          </div>
        </div>
      )}

      {approved.length > 0 && (
        <div>
          <h2 className="text-[15px] font-bold text-text-strong mb-3">
            Publicadas ({approved.length})
          </h2>
          <div className="space-y-3">
            {approved.map((r) => (
              <ReviewRow key={r.id} review={r} />
            ))}
          </div>
        </div>
      )}

      {(reviews ?? []).length === 0 && (
        <p className="text-[14px] text-text-muted">Nenhuma avaliação ainda.</p>
      )}
    </div>
  );
}

function ReviewRow({ review }: { review: any }) {
  return (
    <div className="bg-white border border-border-subtle rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13.5px] font-semibold text-text-strong">{review.author_name}</span>
          <span className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < review.rating ? "fill-brand-yellow text-brand-yellow" : "text-border-subtle"
                }`}
              />
            ))}
          </span>
          {review.approved ? (
            <span className="text-[11px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">publicada</span>
          ) : (
            <span className="text-[11px] bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">pendente</span>
          )}
        </div>
        <p className="text-[12px] text-text-muted mt-0.5">
          {review.tour?.title ?? "Passeio removido"} · {new Date(review.created_at).toLocaleDateString("pt-BR")}
        </p>
        <p className="text-[13px] text-text-strong/85 mt-2 leading-snug">{review.body}</p>
      </div>
      <div className="flex sm:flex-col gap-2 shrink-0">
        {!review.approved && (
          <form action={approveReview.bind(null, review.id)}>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1.5 rounded-lg text-[12.5px] w-full"
            >
              Aprovar
            </button>
          </form>
        )}
        <form action={deleteReview.bind(null, review.id)}>
          <button
            type="submit"
            className="bg-white border border-red-300 hover:bg-red-50 text-red-600 font-semibold px-3 py-1.5 rounded-lg text-[12.5px] w-full"
          >
            Excluir
          </button>
        </form>
      </div>
    </div>
  );
}
