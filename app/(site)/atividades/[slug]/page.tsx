import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Clock,
  Users,
  ShieldCheck,
  Tag,
  MapPin,
  Share2,
  Check,
} from "lucide-react";
import { getTourBySlug, listTours } from "@/lib/data";
import { getCurrentUser, getFavoriteIds } from "@/lib/auth";
import { TourGallery } from "@/components/site/tour-gallery";
import { BookingWidget } from "@/components/site/booking-widget";
import { PartnerBookingButton } from "@/components/site/partner-booking-button";
import { TourCard } from "@/components/site/tour-card";
import { FavoriteButton } from "@/components/site/favorite-button";
import { ReviewsSection } from "@/components/site/reviews-section";
import { formatRating } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const [others, user, favIds] = await Promise.all([
    listTours({ limit: 6 }).then((rows) => rows.filter((t) => t.id !== tour.id).slice(0, 5)),
    getCurrentUser(),
    getFavoriteIds(),
  ]);
  const isAuthed = !!user;
  const isFavorite = favIds.has(tour.id);

  // Extract a partner widget URL: either set directly, or parsed from a pasted
  // <iframe src="..."> snippet. Returns null if neither is available.
  const widgetUrl: string | null =
    tour.booking_widget_url ??
    (tour.booking_widget_html
      ? (tour.booking_widget_html.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)?.[1] ?? null)
      : null);
  const hasPartnerWidget = !!widgetUrl;

  // Whether we have enough custom content (gallery / description / highlights)
  // to show our editorial sections in addition to the partner widget.
  const hasGallery =
    !!tour.cover_image || (tour.gallery && tour.gallery.length > 0);
  const hasDescription = !!(tour.description || tour.short_description);
  const hasHighlights = tour.highlights && tour.highlights.length > 0;
  const hasIncluded = tour.included && tour.included.length > 0;
  const hasMeetingPoint = !!tour.meeting_point;

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="mx-auto max-w-[1240px] px-5 pt-6 pb-2 text-[12.5px] text-text-muted flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-text-strong">Home</Link>
          <span>›</span>
          <Link href="/atividades" className="hover:text-text-strong">Activities</Link>
          {tour.destination ? (
            <>
              <span>›</span>
              <Link
                href={`/atividades?destino=${tour.destination.slug}`}
                className="hover:text-text-strong"
              >
                {tour.destination.name}
              </Link>
            </>
          ) : null}
          <span>›</span>
          <span className="text-text-strong line-clamp-1">{tour.title}</span>
        </div>

        {hasGallery ? (
          <div className="mx-auto max-w-[1240px] px-5 pb-5">
            <TourGallery
              cover={tour.cover_image}
              gallery={tour.gallery}
              title={tour.title}
            />
          </div>
        ) : null}

        <div className="mx-auto max-w-[1240px] px-5 pb-6 pt-2">
          {tour.badge ? (
            <span className="inline-block bg-brand-yellow text-navy-900 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded mb-3">
              {tour.badge}
            </span>
          ) : null}
          <h1 className="font-display text-[28px] md:text-[36px] font-extrabold text-text-strong leading-tight">
            {tour.title}
          </h1>

          <div className="mt-2 flex items-center gap-3 flex-wrap text-[13px] text-text-muted">
            {tour.rating ? (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
                <span className="text-text-strong font-semibold">
                  {formatRating(tour.rating)}
                </span>
                <span>({tour.reviews_count} reviews)</span>
              </span>
            ) : null}
            {tour.duration ? (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {tour.duration}
              </span>
            ) : null}
            {tour.destination ? (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-navy-700" />
                {tour.destination.name}, Algarve
              </span>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Chip icon={<ShieldCheck className="w-4 h-4" />} label="Free cancellation" />
            <Chip icon={<Tag className="w-4 h-4" />} label="Book now, pay later" />
            <Chip icon={<Users className="w-4 h-4" />} label="Local expert guide" />
            <Chip icon={<Star className="w-4 h-4" />} label="Best price guaranteed" />
          </div>

          <div className="mt-4 flex items-center gap-3 text-[13px] text-text-muted">
            <FavoriteButton
              tourId={tour.id}
              initial={isFavorite}
              isAuthed={isAuthed}
            />
            <button className="flex items-center gap-1 hover:text-text-strong">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </section>

      {/* ─────────── Body: editorial + sticky booking card ─────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div>
            {hasDescription ? (
              <div>
                <h2 className="font-display text-[20px] font-bold text-text-strong">
                  About this experience
                </h2>
                <p className="mt-2 text-[14px] text-text-strong/85 leading-relaxed whitespace-pre-line">
                  {tour.description ?? tour.short_description}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border-subtle bg-surface-alt p-6">
                <p className="text-[14px] text-text-strong font-semibold">
                  Ready to explore the Algarve?
                </p>
                <p className="text-[13px] text-text-muted mt-1">
                  Click "Check availability & book" to see live dates, prices
                  and details from our trusted local partner — and secure your
                  spot in a few clicks.
                </p>
              </div>
            )}

            {hasHighlights ? (
              <div className="mt-8">
                <h2 className="font-display text-[20px] font-bold text-text-strong">
                  Highlights
                </h2>
                <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[13.5px] text-text-strong/90">
                  {tour.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {hasIncluded ? (
              <div className="mt-8">
                <h2 className="font-display text-[20px] font-bold text-text-strong">
                  What's included
                </h2>
                <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[13.5px] text-text-strong/90">
                  {tour.included.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {hasMeetingPoint ? (
              <div className="mt-8">
                <h2 className="font-display text-[20px] font-bold text-text-strong">
                  Meeting point
                </h2>
                <p className="mt-3 text-[13.5px] text-text-strong/90 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-navy-700 mt-0.5 shrink-0" />
                  {tour.meeting_point}
                </p>
              </div>
            ) : null}

            <ReviewsSection
              rating={tour.rating}
              reviewsCount={tour.reviews_count}
            />
          </div>

          {/* Sticky booking card */}
          <aside className="lg:sticky lg:top-6 self-start">
            {hasPartnerWidget ? (
              <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-sm space-y-4">
                <div>
                  <p className="text-[12.5px] uppercase tracking-wide text-text-muted font-semibold">
                    Book this experience
                  </p>
                  <p className="mt-1 text-[14px] text-text-strong">
                    Live availability, secure checkout — handled by our local
                    partner.
                  </p>
                </div>
                <PartnerBookingButton
                  src={widgetUrl!}
                  label="Check availability & book"
                />
                <ul className="text-[12.5px] text-text-muted space-y-1.5">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-success" /> Free
                    cancellation up to 24h
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-success" /> Reserve now,
                    pay later
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-success" /> Instant
                    confirmation
                  </li>
                </ul>
              </div>
            ) : (
              <BookingWidget tour={tour} />
            )}
          </aside>
        </div>
      </section>

      {others.length > 0 ? (
        <section className="bg-surface-alt">
          <div className="mx-auto max-w-[1240px] px-5 py-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-text-strong">
                Other experiences you may like
              </h2>
              <Link
                href="/atividades"
                className="text-[13.5px] font-semibold text-navy-700 hover:underline"
              >
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {others.map((t) => (
                <TourCard
                  key={t.id}
                  tour={t}
                  compact
                  isAuthed={isAuthed}
                  isFavorite={favIds.has(t.id)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-alt text-[12.5px] text-text-strong">
      <span className="text-navy-700">{icon}</span>
      {label}
    </span>
  );
}
