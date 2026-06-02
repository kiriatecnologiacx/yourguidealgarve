import { translateLines, type TranslateLang } from "./translate";
import type { Block } from "./blog-blocks";

type Position = { blockIndex: number; field: string; subIndex?: number };

export async function translateBlocks(blocks: Block[], targetLang: TranslateLang): Promise<Block[]> {
  const texts: string[] = [];
  const positions: Position[] = [];

  blocks.forEach((block, i) => {
    switch (block.type) {
      case "text":
      case "heading":
        if (block.content) { texts.push(block.content); positions.push({ blockIndex: i, field: "content" }); }
        break;
      case "image":
        if (block.caption) { texts.push(block.caption); positions.push({ blockIndex: i, field: "caption" }); }
        if (block.alt)     { texts.push(block.alt);     positions.push({ blockIndex: i, field: "alt" }); }
        break;
      case "image-grid":
        block.images.forEach((img, j) => {
          if (img.alt) { texts.push(img.alt); positions.push({ blockIndex: i, field: "alt", subIndex: j }); }
        });
        break;
      case "quote":
        if (block.content) { texts.push(block.content); positions.push({ blockIndex: i, field: "content" }); }
        if (block.author)  { texts.push(block.author);  positions.push({ blockIndex: i, field: "author" }); }
        break;
      case "cta":
        if (block.label) { texts.push(block.label); positions.push({ blockIndex: i, field: "label" }); }
        break;
    }
  });

  if (texts.length === 0) return blocks;

  const translated = await translateLines(texts, targetLang);

  // Deep-clone blocks and apply translations
  const result: Block[] = JSON.parse(JSON.stringify(blocks));

  positions.forEach((pos, idx) => {
    const block = result[pos.blockIndex] as any;
    if (pos.field === "content")  block.content = translated[idx];
    else if (pos.field === "caption") block.caption = translated[idx];
    else if (pos.field === "alt" && block.type === "image") block.alt = translated[idx];
    else if (pos.field === "alt" && block.type === "image-grid") block.images[pos.subIndex!].alt = translated[idx];
    else if (pos.field === "author") block.author = translated[idx];
    else if (pos.field === "label")  block.label  = translated[idx];
  });

  return result;
}
