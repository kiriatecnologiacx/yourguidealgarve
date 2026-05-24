import Image from "next/image";
import type { Block } from "@/lib/blog-blocks";

export function BlogBlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <BlockNode key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlockNode({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return (
        <p className="text-[15px] leading-[1.75] text-text-strong/90 whitespace-pre-line">
          {block.content}
        </p>
      );

    case "heading":
      if (block.level === "h2") {
        return (
          <h2 className="font-display mt-2 text-2xl font-extrabold text-text-strong">
            {block.content}
          </h2>
        );
      }
      return (
        <h3 className="font-display mt-1 text-xl font-bold text-text-strong">
          {block.content}
        </h3>
      );

    case "image":
      return (
        <figure className="my-2">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <Image
              src={block.url}
              alt={block.alt ?? block.caption ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 760px) 100vw, 760px"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-2 text-center text-[12px] text-text-muted italic">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case "image-grid":
      return (
        <div className={`grid gap-3 my-2 ${block.columns === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {block.images.filter((img) => img.url).map((img, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <Image
                src={img.url}
                alt={img.alt ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 760px) 50vw, 380px"
              />
            </div>
          ))}
        </div>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-brand-yellow pl-5 my-2">
          <p className="text-[16px] leading-relaxed text-text-strong/85 font-medium italic">
            {block.content}
          </p>
          {block.author ? (
            <cite className="mt-2 block text-[12.5px] text-text-muted not-italic">
              — {block.author}
            </cite>
          ) : null}
        </blockquote>
      );

    case "divider":
      return <hr className="border-border-subtle my-2" />;

    case "cta":
      return (
        <div className="text-center my-4">
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-8 py-3 rounded-xl text-[15px] transition-colors"
          >
            {block.label}
          </a>
        </div>
      );

    default:
      return null;
  }
}
