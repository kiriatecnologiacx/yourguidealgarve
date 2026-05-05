import Image from "next/image";
import { Plus, Star } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";
import { deleteDestination, upsertDestination } from "./actions";
import { DeleteRowButton } from "@/components/admin/delete-row-button";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("destinations")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });
  const destinations = data ?? [];

  return (
    <div className="px-6 lg:px-10 py-8 max-w-4xl">
      <h1 className="text-2xl font-extrabold text-text-strong">Destinos</h1>
      <p className="text-[13.5px] text-text-muted">
        Cidades e regiões do Algarve exibidas no site (Lagos, Faro, etc).
      </p>

      <section className="mt-6 bg-white border border-border-subtle rounded-2xl p-5">
        <h2 className="text-[15px] font-bold text-text-strong">Adicionar destino</h2>
        <form
          action={upsertDestination}
          className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <input
            name="name"
            required
            placeholder="Nome (ex.: Albufeira)"
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
            name="activities_count"
            type="number"
            placeholder="Nº de atividades"
            defaultValue={0}
            className="rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700"
          />
          <label className="flex items-center gap-2 text-[13px] text-text-strong px-1">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked
              className="w-4 h-4 accent-navy-800"
            />
            Destacar na home
          </label>
          <button
            type="submit"
            className="md:col-span-2 justify-self-start bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-4 py-2.5 rounded-lg text-[13.5px] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Cadastrar destino
          </button>
        </form>
      </section>

      <section className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {destinations.map((d) => (
          <div
            key={d.id}
            className="bg-white border border-border-subtle rounded-2xl overflow-hidden"
          >
            <div className="relative h-[120px] bg-surface-alt">
              {d.image ? (
                <Image src={d.image} alt={d.name} fill className="object-cover" sizes="280px" />
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
              <DeleteRowButton
                id={d.id}
                action={deleteDestination}
                label="Excluir destino?"
              />
            </div>
          </div>
        ))}
        {destinations.length === 0 ? (
          <p className="text-[13.5px] text-text-muted col-span-full">
            Nenhum destino cadastrado.
          </p>
        ) : null}
      </section>
    </div>
  );
}
