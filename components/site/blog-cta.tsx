import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { listBlogPosts } from "@/lib/blog";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export async function BlogCTA() {
  const [posts, locale] = await Promise.all([listBlogPosts(3), getLocale()]);
  if (posts.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-12">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-brand-orange">
              <BookOpen className="w-3.5 h-3.5" /> {t(locale, "section.blog.eyebrow")}
            </span>
            <h2 className="font-display mt-1 text-3xl md:text-4xl font-extrabold text-text-strong">
              {t(locale, "section.blog.title")}
            </h2>
            <p className="mt-1 text-[13.5px] text-text-muted max-w-md">
              {t(locale, "section.blog.lead")}
            </p>
          </div>
          <Link
            href="/blog"
            className="bg-navy-800 hover:bg-navy-700 text-white font-semibold px-5 py-2.5 rounded-lg text-[13.5px] flex items-center gap-2"
          >
            {t(locale, "section.blog.cta")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="group bg-white border border-border-subtle rounded-2xl overflow-hidden hover:shadow-lg hover:border-transparent transition-all"
            >
              <div className="relative h-[180px]">
                <Image
                  src={p.cover_image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="text-[11.5px] uppercase tracking-wider text-brand-orange font-semibold">
                  {p.published_at
                    ? new Date(p.published_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </p>
                <h3 className="font-display mt-1 text-[18px] font-bold text-text-strong leading-snug line-clamp-2">
                  {p.title}
                </h3>
                {p.excerpt ? (
                  <p className="mt-1.5 text-[13px] text-text-muted line-clamp-2">
                    {p.excerpt}
                  </p>
                ) : null}
                <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-navy-700 group-hover:text-brand-orange">
                  {t(locale, "section.blog.readMore")} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
