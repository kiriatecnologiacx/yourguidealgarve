import Image from "next/image";
import { Plus } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";
import { deleteCategory, upsertCategory } from "./actions";
import { DeleteRowButton } from "@/components/admin/delete-row-button";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("position", { ascending: true });
  const categories = data ?? [];

  return (
    <div className="px-6 lg:px-10 py-8 max-w-4xl">
      <h1 className="text-2xl font-extrabold text-text-strong">Categorias</h1>
      <p className="text-[13.5px] text-text-muted">
        Categorias exibidas na seção “Explore por categoria” da home.
      </p>

      <section className="mt-6 bg-white border border-border-subtle rounded-2xl p-5">
        <h2 className="text-[15px] font-bold text-text-strong">Adicionar categoria</h2>
        <form
          action={upsertCategory}
          className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <input
            name="name"
            required
            placeholder="Nome (ex.: Passeios de barco)"
            className="rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700"
          />
          <input
            name="slug"
            placeholder="slug (opcional)"
            className="rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700"
          />
          <input
            name="image"
            required
            placeholder="URL da imagem"
            className="rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700 md:col-span-2"
          />
          <input
            name="icon"
            placeholder="Ícone (ex.: 🚤)"
            className="rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700"
          />
          <input
            name="position"
            type="number"
            placeholder="Ordem (0 = primeiro)"
            className="rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700"
          />
          <button
            type="submit"
            className="md:col-span-2 justify-self-start bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-4 py-2.5 rounded-lg text-[13.5px] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Cadastrar categoria
          </button>
        </form>
      </section>

      <section className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-border-subtle rounded-2xl overflow-hidden"
          >
            <div className="relative h-[120px] bg-surface-alt">
              {c.image ? (
                <Image src={c.image} alt={c.name} fill className="object-cover" sizes="280px" />
              ) : null}
            </div>
            <div className="p-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-text-strong line-clamp-1">
                  {c.icon ? `${c.icon} ` : ""}{c.name}
                </p>
                <p className="text-[11.5px] text-text-muted">/{c.slug}</p>
              </div>
              <DeleteRowButton
                id={c.id}
                action={deleteCategory}
                label="Excluir categoria?"
              />
            </div>
          </div>
        ))}
        {categories.length === 0 ? (
          <p className="text-[13.5px] text-text-muted col-span-full">
            Nenhuma categoria cadastrada.
          </p>
        ) : null}
      </section>
    </div>
  );
}
