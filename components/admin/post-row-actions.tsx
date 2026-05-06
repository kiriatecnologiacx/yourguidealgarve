"use client";

import { useTransition } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { deletePost, togglePostPublish } from "@/app/admin/blog/actions";

export function PostRowActions({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const [pending, start] = useTransition();
  return (
    <>
      <button
        title={isPublished ? "Despublicar" : "Publicar"}
        disabled={pending}
        onClick={() => start(() => togglePostPublish(id, !isPublished))}
        className="grid place-items-center w-8 h-8 rounded-md text-text-muted hover:text-text-strong hover:bg-surface-alt disabled:opacity-40"
      >
        {isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      <button
        title="Excluir"
        disabled={pending}
        onClick={() => {
          if (confirm("Excluir esta postagem?")) start(() => deletePost(id));
        }}
        className="grid place-items-center w-8 h-8 rounded-md text-text-muted hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );
}
