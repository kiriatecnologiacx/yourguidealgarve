"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";

export function TourGallery({
  cover,
  gallery,
  title,
}: {
  cover: string | null;
  gallery: string[];
  title: string;
}) {
  const effectiveCover = cover ?? gallery[0] ?? null;
  const remaining = cover ? gallery : gallery.slice(1);
  const thumbs = remaining.slice(0, 4);
  const total = remaining.length;

  // All images in order: cover first, then gallery
  const allImages = [
    ...(effectiveCover ? [effectiveCover] : []),
    ...remaining,
  ];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() => setLightboxIndex((i) => (i !== null ? (i - 1 + allImages.length) % allImages.length : null)), [allImages.length]);
  const next = useCallback(() => setLightboxIndex((i) => (i !== null ? (i + 1) % allImages.length : null)), [allImages.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, prev, next]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) next();
    else prev();
  }

  if (!effectiveCover) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2 rounded-2xl overflow-hidden">
        <button
          className="relative h-[360px] md:h-[460px] block w-full text-left"
          onClick={() => setLightboxIndex(0)}
          aria-label="Ver foto principal"
        >
          <Image
            src={effectiveCover}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-cover"
          />
        </button>
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[360px] md:h-[460px]">
          {thumbs.map((img, i) => (
            <button
              key={i}
              className="relative block w-full h-full text-left"
              onClick={() => setLightboxIndex(i + 1)}
              aria-label={`Ver foto ${i + 2}`}
            >
              <Image
                src={img}
                alt={`${title} - ${i + 1}`}
                fill
                sizes="25vw"
                className="object-cover"
              />
              {i === thumbs.length - 1 && total > thumbs.length ? (
                <span className="absolute right-3 bottom-3 flex items-center gap-1 bg-white/95 hover:bg-white text-navy-900 text-[12.5px] font-semibold px-2.5 py-1.5 rounded-lg pointer-events-none">
                  <Camera className="w-3.5 h-3.5" /> +{total - thumbs.length} fotos
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null ? (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center select-none"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            className="absolute top-4 right-4 z-10 grid place-items-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white"
            onClick={closeLightbox}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {allImages.length > 1 ? (
            <>
              <button
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Próxima"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          ) : null}

          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-14 sm:mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[lightboxIndex]}
              alt={`${title} - ${lightboxIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-[13px]">
            {lightboxIndex + 1} / {allImages.length}
          </span>
        </div>
      ) : null}
    </>
  );
}
