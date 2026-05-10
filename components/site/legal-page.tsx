import Image from "next/image";
import type { LegalPage } from "@/lib/legal-content";

export function LegalPageView({
  page,
  hero,
  heroImage,
}: {
  page: LegalPage;
  hero?: React.ReactNode;
  heroImage?: { src: string; alt: string };
}) {
  return (
    <article className="bg-surface-alt min-h-[60vh]">
      <div className="relative bg-navy-800 text-white overflow-hidden">
        {heroImage ? (
          <>
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center -z-10"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,37,64,0.55) 0%, rgba(10,37,64,0.85) 100%), linear-gradient(105deg, rgba(255,138,61,0.15) 0%, transparent 55%)",
              }}
            />
          </>
        ) : null}
        <div className={`relative mx-auto max-w-[820px] px-5 ${heroImage ? "py-20 md:py-28" : "py-12"}`}>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)]">
            {page.title}
          </h1>
          {page.updated ? (
            <p className="mt-2 text-[12.5px] text-white/70">{page.updated}</p>
          ) : null}
          {hero}
        </div>
      </div>

      <div className="mx-auto max-w-[820px] px-5 py-10">
        {page.intro && page.intro.length > 0 ? (
          <div className="space-y-4 text-[15px] leading-[1.7] text-text-strong/90 mb-8">
            {page.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : null}

        <div className="space-y-7">
          {page.sections.map((s, i) => (
            <section key={i} className="space-y-3">
              {s.heading ? (
                <h2 className="font-display text-[18px] md:text-[20px] font-bold text-text-strong">
                  {s.heading}
                </h2>
              ) : null}
              {s.paragraphs?.map((p, j) => (
                <p
                  key={j}
                  className="text-[14.5px] leading-[1.7] text-text-strong/85"
                >
                  {p}
                </p>
              ))}
              {s.bullets ? (
                <ul className="list-disc pl-5 space-y-1.5 text-[14.5px] leading-[1.65] text-text-strong/85 marker:text-brand-orange">
                  {s.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
