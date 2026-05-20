export type BlockType =
  | "text"
  | "heading"
  | "image"
  | "image-grid"
  | "quote"
  | "divider"
  | "cta";

export type TextBlock = { id: string; type: "text"; content: string };
export type HeadingBlock = { id: string; type: "heading"; level: "h2" | "h3"; content: string };
export type ImageBlock = { id: string; type: "image"; url: string; caption?: string; alt?: string };
export type ImageGridBlock = { id: string; type: "image-grid"; columns: 2 | 3; images: { url: string; alt?: string }[] };
export type QuoteBlock = { id: string; type: "quote"; content: string; author?: string };
export type DividerBlock = { id: string; type: "divider" };
export type CTABlock = { id: string; type: "cta"; label: string; url: string };

export type Block =
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | ImageGridBlock
  | QuoteBlock
  | DividerBlock
  | CTABlock;

export function createBlock(type: BlockType): Block {
  const id = crypto.randomUUID();
  switch (type) {
    case "text": return { id, type, content: "" };
    case "heading": return { id, type, level: "h2", content: "" };
    case "image": return { id, type, url: "", caption: "", alt: "" };
    case "image-grid": return { id, type, columns: 2, images: [{ url: "", alt: "" }, { url: "", alt: "" }] };
    case "quote": return { id, type, content: "", author: "" };
    case "divider": return { id, type };
    case "cta": return { id, type, label: "", url: "" };
  }
}
