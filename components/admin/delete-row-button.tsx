"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function DeleteRowButton({
  id,
  action,
  label,
}: {
  id: string;
  action: (id: string) => Promise<void>;
  label: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(label)) start(() => action(id));
      }}
      className="grid place-items-center w-8 h-8 rounded-md text-text-muted hover:text-red-600 hover:bg-red-50 disabled:opacity-40 inline-grid"
      title="Excluir"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
