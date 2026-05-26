import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Clock,
  Users,
  ShieldCheck,
  MapPin,
  Check,
  X,
  AlertTriangle,
  Backpack,
  Lightbulb,
} from "lucide-react";
import { getTourBySlug, listTours, getReviewsByTourId } from "@/lib/data";
import { getCurrentUser, getFavoriteIds } from "@/lib/auth";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { TourGallery } from "@/components/site/tour-gallery";
import { BookingWidget } from "@/components/site/booking-widget";
import { PartnerBookingButton } from "@/components/site/partner-booking-button";
import { PartnerEmbeddedWidget } from "@/components/site/partner-embedded-widget";
import { TourCard } from "@/components/site/tour-card";
import { FavoriteButton } from "@/components/site/favorite-button";
import { ReviewsSection } from "@/components/site/reviews-section";
import { ShareButton } from "@/components/site/share-button";
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

  const [others, user, favIds, reviews, locale] = await Promise.all([
    listTours({ limit: 6 }).then((rows) => rows.filter((r) => r.id !== tour.id).slice(0, 5)),
    getCurrentUser(),
    getFavoriteIds(),
    getReviewsByTourId(tour.id),
    getLocale(),
  ]);
  const isAuthed = !!user;
  const isFavorite = favIds.has(tour.id);

  const widgetUrl: string | null =
    tour.booking_widget_url ??
    (tour.booking_widget_html
      ? (tour.booking_widget_html.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)?.[1] ?? null)
      : null);

  const isWidgetMode = tour.tour_mode === "widget";
  const hasPartnerWidget = !!widgetUrl;

  // Locale-aware text fallback: use translated field if available, else English
  const localTitle =
    locale === "pt-PT" ? (tour.title_pt || tour.title) :
    locale === "fr"    ? (tour.title_fr || tour.title) :
    tour.title;
  const localShortDesc =
    locale === "pt-PT" ? (tour.short_description_pt || tour.short_description) :
    locale === "fr"    ? (tour.short_description_fr || tour.short_description) :
    tour.short_description;
  const localDescription =
    locale === "pt-PT" ? (tour.description_pt || tour.description) :
    locale === "fr"    ? (tour.description_fr || tour.description) :
    tour.description;
  const localHighlights =
    locale === "pt-PT" ? (tour.highlights_pt?.length ? tour.highlights_pt : tour.highlights) :
    locale === "fr"    ? (tour.highlights_fr?.length ? tour.highlights_fr : tour.highlights) :
    tour.highlights;

  const hasGallery = !!tour.cover_image || (tour.gallery && tour.gallery.length > 0);
  const hasDescription = !!(localDescription || localShortDesc);
  const hasHighlights = localHighlights && localHighlights.length > 0;
  const hasIncluded = tour.included && tour.included.length > 0;
  const hasNotIncluded = tour.not_included && tour.not_included.length > 0;
  const hasMeetingPoint = !!tour.meeting_point;
  const hasLanguages = tour.languages && tour.languages.length > 0;
  const hasImportantInfo = !!tour.important_info;
  const hasWhatToBring = !!tour.what_to_bring;
  const hasTips = !!tour.tips;

  return (
    <>
      {/* ─── Header comum ─── */}
      <section className="bg-white border-b border-border-subtle">
        <div className="mx-auto max-w-[1240px] px-5 pt-6 pb-2 text-[12.5px] text-text-muted flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-text-strong">{t(locale, "nav.destinations") === "Destinos" ? "Início" : "Home"}</Link>
          <span>›</span>
          <Link href="/atividades" className="hover:text-text-strong">{t(locale, "nav.activities")}</Link>
          {tour.destination ? (
            <>
              <span>›</span>
              <Link href={`/atividades?destino=${tour.destination.slug}`} className="hover:text-text-strong">
                {tour.destination.name}
              </Link>
            </>
          ) : null}
          <span>›</span>
          <span className="text-text-strong line-clamp-1">{localTitle}</span>
        </div>

        {hasGallery ? (
          <div className="mx-auto max-w-[1240px] px-5 pb-5">
            <TourGallery cover={tour.cover_image} gallery={tour.gallery} title={localTitle} />
          </div>
        ) : null}

        <div className="mx-auto max-w-[1240px] px-5 pb-6 pt-2">
          {tour.badge ? (
            <span className="inline-block bg-brand-yellow text-navy-900 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded mb-3">
              {tour.badge}
            </span>
          ) : null}
          <h1 className="font-display text-[28px] md:text-[36px] font-extrabold text-text-strong leading-tight">
            {localTitle}
          </h1>

          <div className="mt-2 flex items-center gap-3 flex-wrap text-[13px] text-text-muted">
            {tour.rating ? (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
                <span className="text-text-strong font-semibold">{formatRating(tour.rating)}</span>
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

          {hasLanguages ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-[12.5px] font-semibold text-text-muted uppercase tracking-wide">Idiomas:</span>
              {tour.languages!.map((lang) => (
                <span key={lang} className="flex items-center gap-1.5 bg-surface-alt border border-border-subtle px-3 py-1.5 rounded-full text-[12.5px] text-text-strong font-medium">
                  🏳️ {lang}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            {tour.free_cancellation ? (
              <Chip icon={<ShieldCheck className="w-4 h-4" />} label={t(locale, "tour.chip.freeCancellation")} />
            ) : null}
            <Chip icon={<Users className="w-4 h-4" />} label={t(locale, "tour.chip.localGuide")} />
          </div>

          <div className="mt-4 flex items-center gap-3 text-[13px] text-text-muted">
            <FavoriteButton tourId={tour.id} initial={isFavorite} isAuthed={isAuthed} />
            <ShareButton title={localTitle} label={t(locale, "tour.share")} />
          </div>
        </div>
      </section>

      {/* ─── Widget mode: iframe full-width ─── */}
      {isWidgetMode && hasPartnerWidget ? (
        <section className="bg-white">
          <div className="mx-auto max-w-[1240px] px-0 md:px-5 py-0 md:py-6 overflow-x-hidden">
            <PartnerEmbeddedWidget
              src={widgetUrl!}
              title={`Reservas — ${localTitle}`}
            />
          </div>
        </section>
      ) : null}

      {/* ─── Widget mode sem widget: botão de reserva ─── */}
      {isWidgetMode && !hasPartnerWidget ? (
        <section className="bg-white">
          <div className="mx-auto max-w-[1240px] px-5 py-8">
            <BookingWidget tour={tour} />
          </div>
        </section>
      ) : null}

      {/* ─── Complete mode: editorial + sidebar ─── */}
      {!isWidgetMode ? (
        <section className="bg-white">
          <div className="mx-auto max-w-[1240px] px-5 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            <div>
              {hasDescription ? (
                <div>
                  <h2 className="font-display text-[20px] font-bold text-text-strong">{t(locale, "tour.about")}</h2>
                  <p className="mt-2 text-[14px] text-text-strong/85 leading-relaxed whitespace-pre-line">
                    {localDescription ?? localShortDesc}
                  </p>
                </div>
              ) : null}

              {hasHighlights ? (
                <div className="mt-8">
                  <h2 className="font-display text-[20px] font-bold text-text-strong">{t(locale, "tour.highlights")}</h2>
                  <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[13.5px] text-text-strong/90">
                    {localHighlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="text-navy-700 mt-0.5 shrink-0 text-[16px] leading-none">•</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {hasIncluded ? (
                <div className="mt-8">
                  <h2 className="font-display text-[20px] font-bold text-text-strong">{t(locale, "tour.included")}</h2>
                  <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[13.5px] text-text-strong/90">
                    {tour.included.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {hasNotIncluded ? (
                <div className="mt-8">
                  <h2 className="font-display text-[20px] font-bold text-text-strong">{t(locale, "tour.notIncluded")}</h2>
                  <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[13.5px] text-text-strong/90">
                    {tour.not_included.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {hasMeetingPoint ? (
                <div className="mt-8">
                  <h2 className="font-display text-[20px] font-bold text-text-strong">{t(locale, "tour.meetingPoint")}</h2>
                  <p className="mt-3 text-[13.5px] text-text-strong/90 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-navy-700 mt-0.5 shrink-0" />
                    {tour.meeting_point}
                  </p>
                </div>
              ) : null}

              {hasImportantInfo ? (
                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <h2 className="font-display text-[18px] font-bold text-amber-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Informação Importante
                  </h2>
                  <p className="mt-2 text-[13.5px] text-amber-900/85 leading-relaxed whitespace-pre-line">
                    {tour.important_info}
                  </p>
                </div>
              ) : null}

              {hasWhatToBring ? (
                <div className="mt-8">
                  <h2 className="font-display text-[20px] font-bold text-text-strong flex items-center gap-2">
                    <Backpack className="w-5 h-5 text-navy-700" /> O que trazer
                  </h2>
                  <p className="mt-2 text-[13.5px] text-text-strong/90 leading-relaxed whitespace-pre-line">
                    {tour.what_to_bring}
                  </p>
                </div>
              ) : null}

              {hasTips ? (
                <div className="mt-8 bg-navy-50 border border-navy-200 rounded-2xl p-5">
                  <h2 className="font-display text-[18px] font-bold text-navy-900 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" /> Dicas
                  </h2>
                  <p className="mt-2 text-[13.5px] text-navy-900/85 leading-relaxed whitespace-pre-line">
                    {tour.tips}
                  </p>
                </div>
              ) : null}

              <ReviewsSection tourId={tour.id} reviews={reviews} />
            </div>

            <aside className="lg:sticky lg:top-6 self-start">
              {hasPartnerWidget ? (
                <div className="bg-white rounded-2xl border border-border-subtle p-4 shadow-sm space-y-3">
                  <div>
                    <p className="text-[12.5px] uppercase tracking-wide text-text-muted font-semibold">{t(locale, "tour.bookExperience")}</p>
                    <p className="mt-1 text-[13.5px] text-text-strong">{t(locale, "tour.liveAvailability")}</p>
                  </div>
                  <PartnerBookingButton src={widgetUrl!} label={t(locale, "tour.checkAvailability")} modalTitle={localTitle} />
                  <ul className="text-[12px] text-text-muted space-y-1.5 pt-1">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-success" /> {t(locale, "tour.chip.freeCancellationUp24")}</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-success" /> {t(locale, "tour.chip.secureCheckout")}</li>
                  </ul>
                </div>
              ) : (
                <BookingWidget tour={tour} />
              )}
            </aside>
          </div>
        </section>
      ) : null}

      {/* Reviews in widget mode */}
      {isWidgetMode && reviews.length > 0 ? (
        <section className="bg-white">
          <div className="mx-auto max-w-[1240px] px-5 pb-8">
            <ReviewsSection tourId={tour.id} reviews={reviews} />
          </div>
        </section>
      ) : null}

      {others.length > 0 ? (
        <section className="bg-surface-alt">
          <div className="mx-auto max-w-[1240px] px-5 py-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-text-strong">
                {locale === "pt-PT" ? "Outras experiências que podem interessar" : locale === "fr" ? "Autres expériences qui pourraient vous plaire" : "Other experiences you may like"}
              </h2>
              <Link href="/atividades" className="text-[13.5px] font-semibold text-navy-700 hover:underline">
                {locale === "pt-PT" ? "Ver todos" : locale === "fr" ? "Voir tout" : "See all"}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {others.map((t) => (
                <TourCard key={t.id} tour={t} compact locale={locale} isAuthed={isAuthed} isFavorite={favIds.has(t.id)} />
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
