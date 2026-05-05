import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Clock,
  Users,
  ShieldCheck,
  Tag,
  MapPin,
  Bookmark,
  Share2,
  Check,
} from "lucide-react";
import { getTourBySlug, listTours } from "@/lib/data";
import { TourGallery } from "@/components/site/tour-gallery";
import { BookingWidget } from "@/components/site/booking-widget";
import { TourCard } from "@/components/site/tour-card";
import { ReviewsSection } from "@/components/site/reviews-section";
import { formatRating } from "@/lib/utils";

export const revalidate = 60;

const TABS = [
  "Visão geral",
  "O que está incluído",
  "Ponto de encontro",
  "Avaliações",
  "Perguntas frequentes",
];

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const others = (await listTours({ limit: 6 })).filter((t) => t.id !== tour.id).slice(0, 5);

  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="mx-auto max-w-[1240px] px-5 pt-6 pb-2 text-[12.5px] text-text-muted flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-text-strong">Início</Link>
          <span>›</span>
          <Link href="/atividades" className="hover:text-text-strong">Atividades</Link>
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

        <div className="mx-auto max-w-[1240px] px-5 pb-5">
          <TourGallery
            cover={tour.cover_image}
            gallery={tour.gallery}
            title={tour.title}
          />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div>
            {tour.badge ? (
              <span className="inline-block bg-brand-yellow text-navy-900 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded mb-3">
                {tour.badge}
              </span>
            ) : null}
            <h1 className="text-[28px] md:text-[32px] font-extrabold text-text-strong leading-tight">
              {tour.title}
            </h1>

            <div className="mt-2 flex items-center gap-3 flex-wrap text-[13px] text-text-muted">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
                <span className="text-text-strong font-semibold">
                  {formatRating(tour.rating)}
                </span>
                <span>({tour.reviews_count} avaliações)</span>
              </span>
              {tour.duration ? (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {tour.duration} de duração
                </span>
              ) : null}
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Chip icon={<ShieldCheck className="w-4 h-4" />} label="Cancelamento gratuito" />
              <Chip icon={<Tag className="w-4 h-4" />} label="Reserve agora, pague depois" />
              <Chip icon={<Users className="w-4 h-4" />} label="Guia local especializado" />
              <Chip icon={<Star className="w-4 h-4" />} label="Melhor preço garantido" />
            </div>

            {tour.destination ? (
              <p className="mt-4 flex items-center gap-1.5 text-[13px] text-text-muted">
                <MapPin className="w-4 h-4 text-navy-700" />
                <span className="text-text-strong">{tour.destination.name}</span>, Algarve, Portugal
              </p>
            ) : null}

            <div className="mt-6 border-b border-border-subtle flex gap-6 overflow-x-auto scrollbar-hide">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  className={`pb-3 text-[13.5px] font-semibold whitespace-nowrap ${
                    i === 0
                      ? "text-text-strong border-b-2 border-navy-800"
                      : "text-text-muted hover:text-text-strong"
                  }`}
                >
                  {tab}
                </button>
              ))}
              <span className="ml-auto flex items-center gap-3 text-[13px] text-text-muted">
                <button className="flex items-center gap-1 hover:text-text-strong">
                  <Bookmark className="w-4 h-4" /> Salvar
                </button>
                <button className="flex items-center gap-1 hover:text-text-strong">
                  <Share2 className="w-4 h-4" /> Compartilhar
                </button>
              </span>
            </div>

            <div className="mt-6">
              <h2 className="text-[18px] font-bold text-text-strong">Sobre esta atividade</h2>
              <p className="mt-2 text-[14px] text-text-strong/85 leading-relaxed">
                {tour.description ?? tour.short_description}
              </p>

              {tour.highlights.length > 0 ? (
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-[13.5px] text-text-strong/90">
                  {tour.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 text-[13px]">
              <Stat label="Duração" value={tour.duration ?? "—"} />
              <Stat label="Idiomas" value="Português, Inglês, Espanhol" />
              <Stat label="Participantes" value="Máx. 12 pessoas" />
              <Stat label="Disponibilidade" value="Diariamente" />
              <Stat
                label="Horários"
                value="09:00, 11:30, 14:00, 16:30"
              />
            </div>

            {tour.included.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-[18px] font-bold text-text-strong">O que está incluído</h2>
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

            {tour.meeting_point ? (
              <div className="mt-8">
                <h2 className="text-[18px] font-bold text-text-strong">Ponto de encontro</h2>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
                  <p className="text-[13.5px] text-text-strong/90 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-navy-700 mt-0.5 shrink-0" />
                    {tour.meeting_point}
                  </p>
                  <div className="bg-surface-alt rounded-xl h-[160px] grid place-items-center text-text-muted text-[12px]">
                    [Mapa]
                  </div>
                </div>
              </div>
            ) : null}

            <ReviewsSection rating={tour.rating} reviewsCount={tour.reviews_count} />
          </div>

          <BookingWidget tour={tour} />
        </div>
      </section>

      {others.length > 0 ? (
        <section className="bg-surface-alt">
          <div className="mx-auto max-w-[1240px] px-5 py-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-extrabold text-text-strong">
                Outras experiências que você pode gostar
              </h2>
              <Link
                href="/atividades"
                className="text-[13.5px] font-semibold text-navy-700 hover:underline"
              >
                Ver todas as atividades
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {others.map((t) => (
                <TourCard key={t.id} tour={t} compact />
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border-subtle rounded-lg p-3">
      <p className="text-[11.5px] text-text-muted">{label}</p>
      <p className="text-[13px] font-semibold text-text-strong mt-0.5">{value}</p>
    </div>
  );
}
