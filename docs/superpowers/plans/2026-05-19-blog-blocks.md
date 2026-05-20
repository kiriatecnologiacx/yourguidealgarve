# Blog com Blocos de Conteúdo — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o campo de texto livre do blog por um editor de blocos drag-and-drop no admin, suportando texto, títulos, imagens, grade de imagens, quote, separador e botão CTA.

**Architecture:** O campo `content` da tabela `blog_posts` passa de `text` para `jsonb`, armazenando um array de blocos `Block[]`. O admin usa `@dnd-kit/sortable` para reordenar blocos. O frontend público renderiza cada bloco com o componente correspondente. Upload de imagem vai para Supabase Storage (bucket `blog-images`).

**Tech Stack:** Next.js 15, React 19, @dnd-kit/core + @dnd-kit/sortable, Supabase Storage, TypeScript, Tailwind v4

---

### Task 1: Instalar dependências e migração de banco

**Files:**
- Modify: `package.json`
- Migration: via Supabase MCP

- [ ] **Step 1: Instalar dnd-kit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Expected: packages instalados sem erros

- [ ] **Step 2: Migração SQL — content para jsonb + criar bucket**

Executar no Supabase (projeto wyligoajwjiveqrwiolz):

```sql
-- Deletar posts fake existentes
DELETE FROM blog_posts;

-- Converter content de text para jsonb
ALTER TABLE blog_posts ALTER COLUMN content TYPE jsonb USING '[]'::jsonb;
```

- [ ] **Step 3: Criar bucket de imagens no Supabase Storage**

Via SQL ou MCP:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: qualquer um pode ler, só authenticated pode fazer upload
CREATE POLICY "blog-images public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "blog-images admin upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
```

- [ ] **Step 4: Commit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git add package.json package-lock.json && git commit -m "feat: instalar @dnd-kit para editor de blocos do blog"
```

---

### Task 2: Tipos de blocos e utilitários

**Files:**
- Create: `lib/blog-blocks.ts`
- Modify: `lib/blog.ts`

- [ ] **Step 1: Criar tipos de blocos**

Criar `/Users/stephaniealbuquerque/Downloads/YouGuideAlgarve/lib/blog-blocks.ts`:

```typescript
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
```

- [ ] **Step 2: Atualizar tipos em lib/blog.ts**

Substituir o tipo `content: string` por `content: Block[]` (import de `Block` de `lib/blog-blocks`):

```typescript
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Block } from "./blog-blocks";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: Block[];
  cover_image: string;
  author: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};

export async function listBlogPosts(limit?: number): Promise<BlogPost[]> {
  const supabase = await createSupabaseServer();
  let q = supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false });
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return (data ?? []) as BlogPost[];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (data as BlogPost | null) ?? null;
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git add lib/blog-blocks.ts lib/blog.ts && git commit -m "feat: tipos de blocos do blog"
```

---

### Task 3: API route de upload de imagem

**Files:**
- Create: `app/api/blog/upload/route.ts`

- [ ] **Step 1: Criar route de upload**

Criar `app/api/blog/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(path);
  return NextResponse.json({ url: publicUrl });
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git add app/api/blog/upload/route.ts && git commit -m "feat: API route de upload de imagem para blog"
```

---

### Task 4: Componentes de edição de cada bloco

**Files:**
- Create: `components/admin/blocks/block-editors.tsx`

- [ ] **Step 1: Criar componentes de edição de bloco**

Criar `components/admin/blocks/block-editors.tsx`:

```typescript
"use client";

import { useRef } from "react";
import { Loader2, Upload, X, Plus, Minus } from "lucide-react";
import { useState } from "react";
import type {
  Block, TextBlock, HeadingBlock, ImageBlock,
  ImageGridBlock, QuoteBlock, CTABlock,
} from "@/lib/blog-blocks";

const inputClass =
  "w-full rounded-lg border border-border-subtle px-3 py-2 text-[13.5px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 bg-white";
const labelClass = "text-[11.5px] font-semibold text-text-muted uppercase tracking-wide";

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/blog/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro no upload");
      onChange(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass + " flex-1"}
          placeholder="https://... ou faça upload abaixo"
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-subtle text-[12.5px] text-text-strong hover:bg-surface-alt disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          Upload
        </button>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      {error ? <p className="text-[11.5px] text-red-600">{error}</p> : null}
      {value ? (
        <img src={value} alt="" className="h-20 w-auto rounded-lg object-cover border border-border-subtle" />
      ) : null}
    </div>
  );
}

export function TextBlockEditor({ block, onChange }: { block: TextBlock; onChange: (b: TextBlock) => void }) {
  return (
    <div className="space-y-1.5">
      <p className={labelClass}>Parágrafo</p>
      <textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        rows={4}
        className={inputClass + " resize-y"}
        placeholder="Escreva o parágrafo..."
      />
    </div>
  );
}

export function HeadingBlockEditor({ block, onChange }: { block: HeadingBlock; onChange: (b: HeadingBlock) => void }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        <p className={labelClass}>Título</p>
        <select
          value={block.level}
          onChange={(e) => onChange({ ...block, level: e.target.value as "h2" | "h3" })}
          className="rounded border border-border-subtle px-2 py-1 text-[12px] bg-white"
        >
          <option value="h2">H2 — Grande</option>
          <option value="h3">H3 — Médio</option>
        </select>
      </div>
      <input
        type="text"
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        className={inputClass}
        placeholder="Título da seção..."
      />
    </div>
  );
}

export function ImageBlockEditor({ block, onChange }: { block: ImageBlock; onChange: (b: ImageBlock) => void }) {
  return (
    <div className="space-y-2">
      <p className={labelClass}>Imagem</p>
      <ImageUploader value={block.url} onChange={(url) => onChange({ ...block, url })} />
      <input
        type="text"
        value={block.caption ?? ""}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
        className={inputClass}
        placeholder="Legenda (opcional)"
      />
    </div>
  );
}

export function ImageGridBlockEditor({ block, onChange }: { block: ImageGridBlock; onChange: (b: ImageGridBlock) => void }) {
  function updateImage(idx: number, url: string) {
    const images = block.images.map((img, i) => i === idx ? { ...img, url } : img);
    onChange({ ...block, images });
  }
  function setColumns(columns: 2 | 3) {
    let images = [...block.images];
    while (images.length < columns) images.push({ url: "", alt: "" });
    if (images.length > columns) images = images.slice(0, columns);
    onChange({ ...block, columns, images });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <p className={labelClass}>Grade de Imagens</p>
        <div className="flex gap-1">
          {([2, 3] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setColumns(n)}
              className={`px-2.5 py-1 rounded text-[12px] font-semibold border transition-colors ${block.columns === n ? "bg-navy-800 text-white border-navy-800" : "border-border-subtle text-text-muted hover:bg-surface-alt"}`}
            >
              {n} colunas
            </button>
          ))}
        </div>
      </div>
      <div className={`grid gap-2 ${block.columns === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {block.images.map((img, idx) => (
          <div key={idx}>
            <p className="text-[10.5px] text-text-muted mb-1">Imagem {idx + 1}</p>
            <ImageUploader value={img.url} onChange={(url) => updateImage(idx, url)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuoteBlockEditor({ block, onChange }: { block: QuoteBlock; onChange: (b: QuoteBlock) => void }) {
  return (
    <div className="space-y-2">
      <p className={labelClass}>Destaque / Quote</p>
      <textarea
        value={block.content}
        onChange={(e) => onChange({ ...block, content: e.target.value })}
        rows={3}
        className={inputClass + " resize-none"}
        placeholder="Texto em destaque..."
      />
      <input
        type="text"
        value={block.author ?? ""}
        onChange={(e) => onChange({ ...block, author: e.target.value })}
        className={inputClass}
        placeholder="Autor (opcional)"
      />
    </div>
  );
}

export function CTABlockEditor({ block, onChange }: { block: CTABlock; onChange: (b: CTABlock) => void }) {
  return (
    <div className="space-y-2">
      <p className={labelClass}>Botão CTA</p>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={block.label}
          onChange={(e) => onChange({ ...block, label: e.target.value })}
          className={inputClass}
          placeholder="Texto do botão"
        />
        <input
          type="url"
          value={block.url}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          className={inputClass}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git add components/admin/blocks/block-editors.tsx && git commit -m "feat: editores individuais de blocos do blog"
```

---

### Task 5: Editor de blocos com drag-and-drop

**Files:**
- Create: `components/admin/blocks/block-editor.tsx`

- [ ] **Step 1: Criar o BlockEditor principal**

Criar `components/admin/blocks/block-editor.tsx`:

```typescript
"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { createBlock, type Block, type BlockType } from "@/lib/blog-blocks";
import {
  TextBlockEditor,
  HeadingBlockEditor,
  ImageBlockEditor,
  ImageGridBlockEditor,
  QuoteBlockEditor,
  CTABlockEditor,
} from "./block-editors";

const BLOCK_LABELS: Record<BlockType, string> = {
  text: "Parágrafo",
  heading: "Título",
  image: "Imagem",
  "image-grid": "Grade de Imagens",
  quote: "Destaque",
  divider: "Separador",
  cta: "Botão CTA",
};

function SortableBlock({
  block,
  onUpdate,
  onRemove,
}: {
  block: Block;
  onUpdate: (b: Block) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  function renderEditor() {
    switch (block.type) {
      case "text": return <TextBlockEditor block={block} onChange={onUpdate} />;
      case "heading": return <HeadingBlockEditor block={block} onChange={onUpdate} />;
      case "image": return <ImageBlockEditor block={block} onChange={onUpdate} />;
      case "image-grid": return <ImageGridBlockEditor block={block} onChange={onUpdate} />;
      case "quote": return <QuoteBlockEditor block={block} onChange={onUpdate} />;
      case "divider": return <p className="text-[12px] text-text-muted italic py-2">— linha separadora —</p>;
      case "cta": return <CTABlockEditor block={block} onChange={onUpdate} />;
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-border-subtle rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-surface-alt border-b border-border-subtle">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="text-text-muted hover:text-text-strong cursor-grab active:cursor-grabbing"
          title="Arrastar para reordenar"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-[11.5px] font-semibold text-text-muted uppercase tracking-wide flex-1">
          {BLOCK_LABELS[block.type]}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-text-muted hover:text-red-500 transition-colors"
          title="Remover bloco"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="p-3">{renderEditor()}</div>
    </div>
  );
}

const ADD_BUTTONS: { type: BlockType; label: string }[] = [
  { type: "text", label: "Parágrafo" },
  { type: "heading", label: "Título" },
  { type: "image", label: "Imagem" },
  { type: "image-grid", label: "Grade" },
  { type: "quote", label: "Destaque" },
  { type: "divider", label: "Separador" },
  { type: "cta", label: "Botão CTA" },
];

export function BlockEditor({
  value,
  onChange,
}: {
  value: Block[];
  onChange: (blocks: Block[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((b) => b.id === active.id);
      const newIndex = value.findIndex((b) => b.id === over.id);
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  }

  function addBlock(type: BlockType) {
    onChange([...value, createBlock(type)]);
  }

  function updateBlock(updated: Block) {
    onChange(value.map((b) => (b.id === updated.id ? updated : b)));
  }

  function removeBlock(id: string) {
    onChange(value.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={value.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {value.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              onUpdate={updateBlock}
              onRemove={() => removeBlock(block.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {value.length === 0 ? (
        <div className="border-2 border-dashed border-border-subtle rounded-xl p-6 text-center text-[13px] text-text-muted">
          Nenhum bloco ainda. Adicione um bloco abaixo.
        </div>
      ) : null}

      <div>
        <p className="text-[11.5px] font-semibold text-text-muted uppercase tracking-wide mb-2 flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Adicionar bloco
        </p>
        <div className="flex flex-wrap gap-2">
          {ADD_BUTTONS.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => addBlock(type)}
              className="px-3 py-1.5 rounded-lg border border-border-subtle text-[12.5px] text-text-strong hover:bg-surface-alt hover:border-navy-700 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git add components/admin/blocks/block-editor.tsx && git commit -m "feat: BlockEditor com drag-and-drop (@dnd-kit)"
```

---

### Task 6: Atualizar PostForm para usar BlockEditor

**Files:**
- Modify: `components/admin/post-form.tsx`
- Modify: `app/admin/blog/actions.ts`

- [ ] **Step 1: Reescrever PostForm**

Substituir o conteúdo de `components/admin/post-form.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, Upload } from "lucide-react";
import { upsertPost } from "@/app/admin/blog/actions";
import type { BlogPost } from "@/lib/blog";
import type { Block } from "@/lib/blog-blocks";
import { BlockEditor } from "@/components/admin/blocks/block-editor";
import { useRef } from "react";

const fieldClass =
  "w-full rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 focus:ring-1 focus:ring-navy-700 bg-white";

export function PostForm({ post }: { post?: BlogPost | null }) {
  const router = useRouter();
  const [blocks, setBlocks] = useState<Block[]>(post?.content ?? []);
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  async function uploadCover(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/blog/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro no upload");
      setCoverImage(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("cover_image", coverImage);
    fd.set("blocks", JSON.stringify(blocks));
    const result = await upsertPost(fd);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    } else {
      router.push("/admin/blog");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <div className="bg-white border border-border-subtle rounded-2xl p-5 space-y-4">
        <Field label="Título" required>
          <input name="title" defaultValue={post?.title ?? ""} required className={fieldClass} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Slug (URL)">
            <input name="slug" defaultValue={post?.slug ?? ""} className={fieldClass} placeholder="meu-post" />
          </Field>
          <Field label="Autor">
            <input name="author" defaultValue={post?.author ?? "Your Guide Algarve"} className={fieldClass} />
          </Field>
        </div>
        <Field label="Resumo (excerpt)">
          <input name="excerpt" defaultValue={post?.excerpt ?? ""} className={fieldClass} placeholder="Uma frase curta que aparece nos cards" />
        </Field>

        <Field label="Imagem de capa" required>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className={fieldClass + " flex-1"}
                placeholder="https://... ou faça upload"
              />
              <button
                type="button"
                onClick={() => coverRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-subtle text-[12.5px] hover:bg-surface-alt disabled:opacity-60"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Upload
              </button>
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); }} />
            {coverImage ? (
              <img src={coverImage} alt="" className="h-24 w-auto rounded-lg object-cover border border-border-subtle" />
            ) : null}
          </div>
        </Field>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_published" defaultChecked={post?.is_published ?? false} className="w-4 h-4 accent-navy-800" />
          <span className="text-[13px] text-text-strong">Publicar agora</span>
        </label>
      </div>

      <div className="bg-white border border-border-subtle rounded-2xl p-5">
        <h2 className="text-[14px] font-bold text-text-strong mb-3">Conteúdo da postagem</h2>
        <BlockEditor value={blocks} onChange={setBlocks} />
      </div>

      {error ? (
        <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-bold px-5 py-2.5 rounded-lg text-[14px] flex items-center gap-2 disabled:opacity-60"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {post ? "Salvar alterações" : "Cadastrar postagem"}
        </button>
        <Link href="/admin/blog" className="text-[13.5px] text-text-muted hover:text-text-strong">Cancelar</Link>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12.5px] font-semibold text-text-strong">
        {label}{required ? <span className="text-red-500"> *</span> : null}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
```

- [ ] **Step 2: Atualizar actions.ts**

Substituir o conteúdo de `app/admin/blog/actions.ts`:

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { Block } from "@/lib/blog-blocks";

async function requireAdmin() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");
  return { supabase, user };
}

export type BlogFormState = { error?: string; ok?: boolean } | undefined;

export async function upsertPost(formData: FormData): Promise<BlogFormState> {
  try {
    const { supabase } = await requireAdmin();
    const id = formData.get("id") ? String(formData.get("id")) : null;
    const title = String(formData.get("title") ?? "").trim();
    const blocksRaw = String(formData.get("blocks") ?? "[]");

    if (!title) return { error: "Título obrigatório" };

    let blocks: Block[];
    try {
      blocks = JSON.parse(blocksRaw);
    } catch {
      return { error: "Conteúdo inválido" };
    }

    const isPublished = formData.get("is_published") === "on";
    const payload = {
      title,
      slug: String(formData.get("slug") ?? "").trim() || slugify(title),
      excerpt: String(formData.get("excerpt") ?? "") || null,
      content: blocks,
      cover_image: String(formData.get("cover_image") ?? "").trim(),
      author: String(formData.get("author") ?? "") || "Your Guide Algarve",
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    };
    if (!payload.cover_image) return { error: "Imagem de capa obrigatória" };

    if (id) {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) return { error: error.message };
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro inesperado" };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function togglePostPublish(id: string, next: boolean) {
  const { supabase } = await requireAdmin();
  await supabase
    .from("blog_posts")
    .update({ is_published: next, published_at: next ? new Date().toISOString() : null })
    .eq("id", id);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git add components/admin/post-form.tsx app/admin/blog/actions.ts && git commit -m "feat: PostForm com BlockEditor integrado"
```

---

### Task 7: Renderizar blocos no frontend público

**Files:**
- Create: `components/site/blog-block-renderer.tsx`
- Modify: `app/(site)/blog/[slug]/page.tsx`

- [ ] **Step 1: Criar componente de renderização de blocos**

Criar `components/site/blog-block-renderer.tsx`:

```typescript
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
        <p className="text-[15px] leading-[1.75] text-text-strong/90">
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
```

- [ ] **Step 2: Atualizar a página pública do post**

Substituir o conteúdo de `app/(site)/blog/[slug]/page.tsx` — substituir a `div` com `prose-blog` pela renderização de blocos:

No arquivo existente, substituir:
```typescript
<div className="mt-6 prose-blog text-[15px] leading-[1.7] text-text-strong/90 whitespace-pre-wrap">
  {post.content.split(/\n\n+/).map((para, i) => { ... })}
</div>
```

Por:
```typescript
import { BlogBlockRenderer } from "@/components/site/blog-block-renderer";
// ...
<div className="mt-6">
  <BlogBlockRenderer blocks={post.content} />
</div>
```

E remover a função `renderInline` que não é mais necessária.

- [ ] **Step 3: Commit**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git add components/site/blog-block-renderer.tsx app/(site)/blog/[slug]/page.tsx && git commit -m "feat: renderização de blocos no frontend do blog"
```

---

### Task 8: Deploy

- [ ] **Step 1: Push para main**

```bash
cd /Users/stephaniealbuquerque/Downloads/YouGuideAlgarve && git push origin main
```

Vercel faz deploy automático ao receber o push.
