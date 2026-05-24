"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Star, Pencil, X } from "lucide-react";
import { upsertDestination, deleteDestination } from "@/app/admin/destinos/actions";
import { DeleteRowButton } from "./delete-row-button";
import { SingleImageUpload } from "./single-image-upload";
import type { Destination } from "@/lib/types";

export function DestinationManager({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [editing, setEditing] = useState<Destination | null>(null);

  function startEdit(d: Destination) {
    setEditing(d);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditing(null);
  }

  const fieldClass =
    "rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 w-full";

  return (
    <>
      {/* Form — add or edit */}
      <section className="mt-6 bg-white border border-border-subtle rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-text-strong">
            {editing ? `Editar: ${editing.name}` : "Adicionar destino"}
          </h2>
          {editing ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center gap-1 text-[12.5px] text-text-muted hover:text-text-strong"
            >
              <X className="w-3.5 h-3.5" /> Cancelar edição
            </button>
          ) : null}
        </div>

        <form
          action={async (fd) => {
            await upsertDestination(fd);
            setEditing(null);
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

          <input
            key={editing?.id ?? "new-name"}
            name="name"
            required
            defaultValue={editing?.name ?? ""}
            placeholder="Nome (ex.: Albufeira)"
            className={fieldClass}
          />
          <input
            key={editing?.id ?? "new-slug"}
            name="slug"
            defaultValue={editing?.slug ?? ""}
            placeholder="slug (opcional)"
            className={fieldClass}
          />
          <div className="md:col-span-2">
            <SingleImageUpload
              key={editing?.id ?? "new"}
              fieldName="image"
              folder="destinations"
              initialUrl={editing?.image}
            />
          </div>
          <input
            key={editing?.id ?? "new-count"}
            name="activities_count"
            type="number"
            defaultValue={editing?.activities_count ?? 0}
            placeholder="Nº de atividades"
            className={fieldClass}
          />
          <label className="flex items-center gap-2 text-[13px] text-text-strong px-1">
            <input
              key={editing?.id ?? "new-featured"}
              type="checkbox"
              name="is_featured"
              defaultChecked={editing ? editing.is_featured : true}
              className="w-4 h-4 accent-navy-800"
            />
            Destacar na home
          </label>
          <button
            type="submit"
            className="md:col-span-2 justify-self-start bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-4 py-2.5 rounded-lg text-[13.5px] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {editing ? "Salvar alterações" : "Cadastrar destino"}
          </button>
        </form>
      </section>

      {/* Grid of destination cards */}
      <section className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {destinations.map((d) => (
          <div
            key={d.id}
            className={`bg-white border rounded-2xl overflow-hidden transition ${
              editing?.id === d.id
                ? "border-navy-700 ring-2 ring-navy-700/20"
                : "border-border-subtle"
            }`}
          >
            <div className="relative h-[120px] bg-surface-alt">
              {d.image ? (
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  className="object-cover"
                  sizes="280px"
                  unoptimized={!d.image.includes("supabase.co")}
                />
              ) : null}
              {d.is_featured ? (
                <span className="absolute top-2 left-2 flex items-center gap-1 bg-brand-yellow text-navy-900 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">
                  <Star className="w-3 h-3" /> Destaque
                </span>
              ) : null}
            </div>
            <div className="p-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-text-strong line-clamp-1">
                  {d.name}
                </p>
                <p className="text-[11.5px] text-text-muted">
                  /{d.slug} · {d.activities_count} atividades
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => (editing?.id === d.id ? cancelEdit() : startEdit(d))}
                  className="grid place-items-center w-7 h-7 rounded text-text-muted hover:text-navy-800 hover:bg-surface-alt"
                  title="Editar"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <DeleteRowButton
                  id={d.id}
                  action={deleteDestination}
                  label="Excluir destino?"
                />
              </div>
            </div>
          </div>
        ))}
        {destinations.length === 0 ? (
          <p className="text-[13.5px] text-text-muted col-span-full">
            Nenhum destino cadastrado.
          </p>
        ) : null}
      </section>
    </>
  );
}
