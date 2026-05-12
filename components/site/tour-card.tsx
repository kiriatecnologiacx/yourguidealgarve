import Link from "next/link";
import { Star } from "lucide-react";
import type { Tour } from "@/lib/types";
import { formatPriceBRL, formatRating } from "@/lib/utils";
import { FavoriteButton } from "./favorite-button";
import { TourImage } from "./tour-image";

export function TourCard({
  tour,
  compact = false,
  isFavorite = false,
  isAuthed = false,
}: {
  tour: Tour;
  compact?: boolean;
  isFavorite?: boolean;
  isAuthed?: boolean;
}) {
  return (
    <Link
      href={`/atividades/${tour.slug}`}
      className="group block bg-white rounded-2xl border border-border-subtle hover:shadow-lg hover:border-transparent transition-all overflow-hidden"
    >
      <div className={`relative ${compact ? "h-[160px]" : "h-[200px]"}`}>
        <TourImage
          src={tour.cover_image ?? tour.gallery?.[0] ?? null}
          alt={tour.title}
          sizes="(max-width: 768px) 50vw, 320px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {tour.badge ? (
          <span className="absolute top-3 left-3 bg-brand-yellow text-navy-900 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded">
            {tour.badge}
          </span>
        ) : null}
        <div className="absolute top-3 right-3">
          <FavoriteButton tourId={tour.id} initial={isFavorite} isAuthed={isAuthed} />
        </div>
      </div>
      <div className="p-4">
        <p className="text-[14.5px] font-semibold text-text-strong leading-tight line-clamp-2">
          {tour.title}
        </p>
        <p className="mt-2 text-[12.5px] text-text-muted flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-brand-yellow text-brand-yellow" />
          <span className="text-text-strong font-semibold">
            {formatRating(tour.rating)}
          </span>
          <span>({tour.reviews_count})</span>
        </p>
        {tour.free_cancellation ? (
          <p className="mt-1.5 text-[11.5px] text-success font-medium">
            Cancelamento gratuito
          </p>
        ) : null}
        <div className="mt-3 flex items-end justify-between">
          <span className="text-[11px] text-text-muted">A partir de</span>
          <span className="text-[16px] font-extrabold text-text-strong">
            {formatPriceBRL(tour.price_from_brl ?? tour.price_brl)}
          </span>
        </div>
      </div>
    </Link>
  );
}
