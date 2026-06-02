import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { listBlogPosts, localeBlogPost } from "@/lib/blog";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const [posts, locale] = await Promise.all([listBlogPosts(), getLocale()]);
  const localePosts = posts.map((p) => localeBlogPost(p, locale));
  const [featured, ...rest] = localePosts;

  const langCode = locale === "pt-PT" ? "pt-BR" : locale === "fr" ? "fr-FR" : "en-GB";

  return (
    <section className="bg-surface-alt min-h-[70vh]">
      <div className="mx-auto max-w-[1240px] px-5 py-10">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-brand-orange">
          <BookOpen className="w-3.5 h-3.5" /> {t(locale, "nav.blog")}
        </span>
        <h1 className="font-display mt-1 text-3xl md:text-4xl font-extrabold text-text-strong">
          {t(locale, "page.blog.title")}
        </h1>

        {posts.length === 0 ? (
          <p className="mt-8 text-[14px] text-text-muted">{t(locale, "page.blog.empty")}</p>
        ) : null}

        {featured ? (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-8 block bg-white rounded-2xl overflow-hidden border border-border-subtle hover:shadow-xl hover:border-transparent transition-all grid md:grid-cols-2"
          >
            <div className="relative h-[260px] md:h-[360px]">
              <Image src={featured.cover_image} alt={featured.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <p className="text-[11.5px] uppercase tracking-wider text-brand-orange font-semibold">
                {featured.published_at ? new Date(featured.published_at).toLocaleDateString(langCode, { day: "2-digit", month: "long", year: "numeric" }) : ""} · {featured.author}
              </p>
              <h2 className="font-display mt-2 text-2xl md:text-3xl font-extrabold text-text-strong leading-tight">{featured.title}</h2>
              {featured.excerpt ? <p className="mt-2 text-[14px] text-text-muted">{featured.excerpt}</p> : null}
              <span className="mt-4 inline-flex items-center gap-1 text-[13.5px] font-semibold text-navy-700 group-hover:text-brand-orange">
                {t(locale, "blog.continueReading")} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ) : null}

        {rest.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {rest.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group bg-white border border-border-subtle rounded-2xl overflow-hidden hover:shadow-lg hover:border-transparent transition-all">
                <div className="relative h-[180px]">
                  <Image src={p.cover_image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <p className="text-[11.5px] uppercase tracking-wider text-brand-orange font-semibold">
                    {p.published_at ? new Date(p.published_at).toLocaleDateString(langCode, { day: "2-digit", month: "short", year: "numeric" }) : ""}
                  </p>
                  <h3 className="font-display mt-1 text-[17px] font-bold text-text-strong leading-snug line-clamp-2">{p.title}</h3>
                  {p.excerpt ? <p className="mt-1.5 text-[13px] text-text-muted line-clamp-2">{p.excerpt}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
