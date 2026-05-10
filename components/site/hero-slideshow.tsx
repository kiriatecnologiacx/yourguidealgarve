"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function HeroSlideshow({
  images,
  intervalMs = 7000,
}: {
  images: { src: string; alt: string }[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <div className="absolute inset-0">
      {images.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-opacity duration-[1600ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center animate-hero-zoom"
          />
        </div>
      ))}
      {/* progress dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-brand-yellow" : "w-3 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
