import Image from "next/image";
import { Camera, Play } from "lucide-react";

export function TourGallery({
  cover,
  gallery,
  title,
}: {
  cover: string;
  gallery: string[];
  title: string;
}) {
  const thumbs = gallery.slice(0, 4);
  const total = gallery.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2 rounded-2xl overflow-hidden">
      <div className="relative h-[360px] md:h-[460px]">
        <Image
          src={cover}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 70vw"
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[360px] md:h-[460px]">
        {thumbs.map((img, i) => (
          <div key={i} className="relative">
            <Image
              src={img}
              alt={`${title} - ${i + 1}`}
              fill
              sizes="25vw"
              className="object-cover"
            />
            {i === 1 ? (
              <button className="absolute inset-0 bg-black/30 grid place-items-center text-white">
                <span className="grid place-items-center w-12 h-12 rounded-full bg-white/90 text-navy-900">
                  <Play className="w-5 h-5 ml-0.5" />
                </span>
              </button>
            ) : null}
            {i === thumbs.length - 1 && total > thumbs.length ? (
              <button className="absolute right-3 bottom-3 flex items-center gap-1 bg-white/95 hover:bg-white text-navy-900 text-[12.5px] font-semibold px-2.5 py-1.5 rounded-lg">
                <Camera className="w-3.5 h-3.5" /> Ver todas as fotos ({total})
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
