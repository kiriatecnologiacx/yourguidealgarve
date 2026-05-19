"use client";

import { useActionState, useState } from "react";
import { Star, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { submitReview, type ReviewFormState } from "@/app/(site)/atividades/[slug]/actions";
import type { Review } from "@/lib/types";

const initial: ReviewFormState = {};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              n <= (hover || value)
                ? "fill-brand-yellow text-brand-yellow"
                : "text-border-subtle"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function WriteReviewForm({ tourId }: { tourId: string }) {
  const [state, action, pending] = useActionState(submitReview, initial);
  const [rating, setRating] = useState(0);

  if (state.success) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-alt p-5 text-center">
        <p className="text-[14px] font-semibold text-text-strong">
          Obrigado pela sua avaliação!
        </p>
        <p className="text-[13px] text-text-muted mt-1">
          Ela será publicada após revisão.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-xl border border-border-subtle bg-white p-5 space-y-4">
      <h3 className="text-[15px] font-bold text-text-strong">
        Escrever avaliação
      </h3>
      <input type="hidden" name="tour_id" value={tourId} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <label className="block text-[12.5px] font-semibold text-text-strong mb-1">
          Sua nota *
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="block text-[12.5px] font-semibold text-text-strong mb-1">
          Seu nome *
        </label>
        <input
          name="author_name"
          required
          className="w-full rounded-lg border border-border-subtle px-3 py-2 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700"
          placeholder="Ex. Maria S."
        />
      </div>

      <div>
        <label className="block text-[12.5px] font-semibold text-text-strong mb-1">
          Sua avaliação *
        </label>
        <textarea
          name="body"
          required
          rows={4}
          className="w-full rounded-lg border border-border-subtle px-3 py-2 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 resize-none"
          placeholder="Conta como foi a experiência..."
        />
      </div>

      {state.error ? (
        <p className="text-[13px] text-red-600">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending || rating === 0}
        className="bg-navy-800 hover:bg-navy-900 text-white font-semibold px-5 py-2.5 rounded-lg text-[14px] flex items-center gap-2 disabled:opacity-50"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Enviar avaliação
      </button>
    </form>
  );
}

function distributionFrom(reviews: Review[]) {
  const counts = [0, 0, 0, 0, 0];
  for (const r of reviews) counts[r.rating - 1]++;
  return [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    pct: reviews.length > 0 ? Math.round((counts[stars - 1] / reviews.length) * 100) : 0,
  }));
}

function avgRating(reviews: Review[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

export function ReviewsSection({
  tourId,
  reviews,
}: {
  tourId: string;
  reviews: Review[];
}) {
  const [showForm, setShowForm] = useState(false);

  const hasReviews = reviews.length > 0;
  const avg = avgRating(reviews);
  const dist = distributionFrom(reviews);

  return (
    <section className="mt-8">
      {hasReviews ? (
        <>
          <h2 className="text-[18px] font-bold text-text-strong">
            Avaliações de quem já fez
          </h2>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 items-start">
            <div>
              <p className="text-[44px] font-extrabold text-text-strong leading-none">
                {avg.toFixed(1).replace(".", ",")}
              </p>
              <span className="flex mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(avg)
                        ? "fill-brand-yellow text-brand-yellow"
                        : "text-border-subtle"
                    }`}
                  />
                ))}
              </span>
              <p className="mt-1 text-[13px] text-text-muted">
                {reviews.length.toLocaleString("pt-BR")} avaliações
              </p>
              <button
                onClick={() => setShowForm((v) => !v)}
                className="mt-3 inline-flex items-center gap-1.5 bg-white border border-navy-700 text-navy-800 font-semibold px-4 py-2 rounded-lg text-[13px] hover:bg-surface-alt"
              >
                Escrever avaliação
                {showForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-2">
              {dist.map((d) => (
                <div key={d.stars} className="flex items-center gap-3 text-[12.5px]">
                  <span className="w-4 text-text-strong font-semibold">{d.stars}</span>
                  <Star className="w-3.5 h-3.5 fill-brand-yellow text-brand-yellow shrink-0" />
                  <div className="flex-1 h-2 rounded-full bg-surface-alt overflow-hidden">
                    <div className="h-full bg-brand-yellow" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="w-9 text-text-muted text-right">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {showForm ? (
            <div className="mt-6">
              <WriteReviewForm tourId={tourId} />
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-border-subtle p-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-navy-800 flex items-center justify-center shrink-0">
                    <span className="text-white text-[13px] font-bold">
                      {r.author_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-text-strong">{r.author_name}</p>
                    <p className="text-[11.5px] text-text-muted">{formatDate(r.created_at)}</p>
                  </div>
                </div>
                <span className="flex mt-2 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < r.rating ? "fill-brand-yellow text-brand-yellow" : "text-border-subtle"
                      }`}
                    />
                  ))}
                </span>
                <p className="text-[13px] text-text-strong/85 leading-snug">{r.body}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-1.5 bg-white border border-navy-700 text-navy-800 font-semibold px-4 py-2 rounded-lg text-[13px] hover:bg-surface-alt"
          >
            Escrever avaliação
            {showForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showForm ? (
            <div className="mt-4">
              <WriteReviewForm tourId={tourId} />
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
