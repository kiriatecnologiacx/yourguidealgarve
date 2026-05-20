"use client";

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
