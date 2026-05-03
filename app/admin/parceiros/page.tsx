import { Plus, Trash2 } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";
import { deletePartner, upsertPartner } from "./actions";
import { DeleteRowButton } from "@/components/admin/delete-row-button";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("partners")
    .select("*")
    .order("name", { ascending: true });
  const partners = data ?? [];

  return (
    <div className="px-6 lg:px-10 py-8 max-w-4xl">
      <h1 className="text-2xl font-extrabold text-text-strong">Parceiros</h1>
      <p className="text-[13.5px] text-text-muted">
        Empresas que fornecem os passeios listados no site.
      </p>

      <section className="mt-6 bg-white border border-border-subtle rounded-2xl p-5">
        <h2 className="text-[15px] font-bold text-text-strong">Adicionar parceiro</h2>
        <form
          action={upsertPartner}
          className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <input
            name="name"
            required
            placeholder="Nome do parceiro"
            className="rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700"
          />
          <input
            name="website"
            placeholder="https://parceiro.com"
            className="rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700"
          />
          <input
            name="contact_email"
            type="email"
            placeholder="contato@parceiro.com"
            className="rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700"
          />
          <input
            name="notes"
            placeholder="Notas internas"
            className="rounded-lg border border-border-subtle px-3 py-2.5 text-[14px] outline-none focus:border-navy-700"
          />
          <button
            type="submit"
            className="md:col-span-2 justify-self-start bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-4 py-2.5 rounded-lg text-[13.5px] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Cadastrar parceiro
          </button>
        </form>
      </section>

      <section className="mt-6 bg-white border border-border-subtle rounded-2xl overflow-hidden">
        {partners.length === 0 ? (
          <p className="p-6 text-[13.5px] text-text-muted">
            Nenhum parceiro cadastrado.
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-surface-alt text-[12px] uppercase tracking-wide text-text-muted">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Nome</th>
                <th className="text-left px-5 py-3 font-semibold">Site</th>
                <th className="text-left px-5 py-3 font-semibold">E-mail</th>
                <th className="text-right px-5 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {partners.map((p) => (
                <tr key={p.id} className="hover:bg-surface-alt">
                  <td className="px-5 py-3 text-[13.5px] font-semibold text-text-strong">
                    {p.name}
                  </td>
                  <td className="px-5 py-3 text-[13px] text-text-strong">
                    {p.website ? (
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy-700 hover:underline"
                      >
                        {p.website.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-3 text-[13px] text-text-strong">
                    {p.contact_email ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <DeleteRowButton
                      id={p.id}
                      action={deletePartner}
                      label="Excluir parceiro?"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
