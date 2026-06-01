import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBlogPost, listBlogPosts } from "@/lib/blog";
import { BlogBlockRenderer } from "@/components/site/blog-block-renderer";
import { getLocale } from "@/lib/locale-server";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, locale] = await Promise.all([getBlogPost(slug), getLocale()]);
  if (!post) notFound();

  const others = (await listBlogPosts(4)).filter((p) => p.slug !== post.slug).slice(0, 3);

  const langCode = locale === "pt-PT" ? "pt-BR" : locale === "fr" ? "fr-FR" : "en-GB";

  return (
    <article className="bg-white">
      <div className="relative h-[300px] md:h-[420px]">
        <Image
          src={post.cover_image}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,37,64,0.2) 30%, rgba(10,37,64,0.85) 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-[860px] px-5 pb-8 w-full text-white">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-[12.5px] text-white/85 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> {t(locale, "blog.backToBlog")}
            </Link>
            <p className="text-[11.5px] uppercase tracking-wider text-brand-yellow font-semibold mt-3">
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString(langCode, {
                    day: "2-digit", month: "long", year: "numeric",
                  })
                : ""} · {post.author}
            </p>
            <h1 className="font-display mt-1 text-3xl md:text-5xl font-extrabold leading-[1.1] max-w-3xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-5 py-10">
        {post.excerpt ? (
          <p className="text-[16px] leading-relaxed text-text-strong/85 font-medium border-l-4 border-brand-yellow pl-4 italic">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-6">
          <BlogBlockRenderer blocks={post.content} />
        </div>
      </div>

      {others.length > 0 ? (
        <div className="bg-surface-alt">
          <div className="mx-auto max-w-[1240px] px-5 py-10">
            <h2 className="font-display text-2xl font-extrabold text-text-strong mb-5">
              {t(locale, "blog.continueReading")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {others.map((p) => (
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
                    <h3 className="font-display text-[17px] font-bold text-text-strong leading-snug line-clamp-2">
                      {p.title}
                    </h3>
                    {p.excerpt ? (
                      <p className="mt-1.5 text-[13px] text-text-muted line-clamp-2">
                        {p.excerpt}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
