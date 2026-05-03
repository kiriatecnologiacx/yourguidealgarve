import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import type { Destination } from "@/lib/types";

export function DestinationRail({ destinations }: { destinations: Destination[] }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-extrabold text-text-strong">
            Destinos em destaque
          </h2>
          <Link
            href="/atividades"
            className="text-[13.5px] font-semibold text-navy-700 hover:underline flex items-center gap-1"
          >
            Ver todos os destinos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {destinations.map((d) => (
            <Link
              key={d.id}
              href={`/atividades?destino=${d.slug}`}
              className="group relative h-[200px] rounded-2xl overflow-hidden"
            >
              <Image
                src={d.image}
                alt={d.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 240px"
              />
              <div className="absolute inset-0 detail-gallery-overlay" />
              <button
                aria-label="Favoritar"
                className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-white/90 hover:bg-white text-navy-700"
              >
                <Heart className="w-4 h-4" />
              </button>
              <div className="absolute left-4 bottom-4 right-4">
                <p className="text-white text-[18px] font-extrabold leading-tight drop-shadow">
                  {d.name}
                </p>
                <p className="text-white/90 text-[12.5px] mt-0.5">
                  {d.activities_count} atividades
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
