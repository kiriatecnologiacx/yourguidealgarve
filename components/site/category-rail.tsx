import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export async function CategoryRail({ categories }: { categories: Category[] }) {
  const locale = await getLocale();
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-text-strong">
            {t(locale, "section.categories.title")}
          </h2>
          <Link
            href="/atividades"
            className="text-[13.5px] font-semibold text-navy-700 hover:underline flex items-center gap-1"
          >
            {t(locale, "section.categories.viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/atividades?categoria=${cat.slug}`}
              className="group relative shrink-0 w-[200px] h-[140px] rounded-2xl overflow-hidden"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="200px"
              />
              <div className="absolute inset-0 detail-gallery-overlay" />
              <div className="absolute left-3 bottom-3 right-3 flex items-center gap-2">
                <span className="grid place-items-center w-7 h-7 rounded-full bg-brand-yellow text-navy-900">
                  <span className="text-[12px]">{cat.icon ?? "★"}</span>
                </span>
                <span className="text-white text-[13.5px] font-semibold drop-shadow">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
