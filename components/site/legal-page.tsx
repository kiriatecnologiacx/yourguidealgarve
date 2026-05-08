import type { LegalPage } from "@/lib/legal-content";

export function LegalPageView({ page, hero }: { page: LegalPage; hero?: React.ReactNode }) {
  return (
    <article className="bg-surface-alt min-h-[60vh]">
      <div className="bg-navy-800 text-white">
        <div className="mx-auto max-w-[820px] px-5 py-12">
          <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-tight">
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
