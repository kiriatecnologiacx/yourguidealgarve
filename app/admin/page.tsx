import Link from "next/link";
import { Compass, Users, Tags, MapPin, Newspaper, Plus } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServer();
  const [tours, partners, categories, destinations, posts] = await Promise.all([
    supabase.from("tours").select("id, is_published", { count: "exact" }),
    supabase.from("partners").select("id", { count: "exact" }),
    supabase.from("categories").select("id", { count: "exact" }),
    supabase.from("destinations").select("id", { count: "exact" }),
    supabase.from("blog_posts").select("id, is_published", { count: "exact" }),
  ]);
  const total = tours.count ?? 0;
  const published = (tours.data ?? []).filter((t) => t.is_published).length;
  const postsTotal = posts.count ?? 0;
  const postsPub = (posts.data ?? []).filter((p) => p.is_published).length;

  return (
    <div className="px-6 lg:px-10 py-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-text-strong">Dashboard</h1>
          <p className="text-[13.5px] text-text-muted">
            Resumo geral do conteúdo do site.
          </p>
        </div>
        <Link
          href="/admin/passeios/novo"
          className="bg-brand-yellow hover:bg-brand-yellow-hover text-navy-900 font-semibold px-4 py-2.5 rounded-lg text-[13.5px] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo passeio
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Stat
          icon={<Compass className="w-5 h-5" />}
          label="Passeios"
          value={total}
          hint={`${published} publicados`}
        />
        <Stat
          icon={<Newspaper className="w-5 h-5" />}
          label="Postagens do blog"
          value={postsTotal}
          hint={`${postsPub} publicadas`}
        />
        <Stat
          icon={<MapPin className="w-5 h-5" />}
          label="Destinos"
          value={destinations.count ?? 0}
        />
        <Stat
          icon={<Users className="w-5 h-5" />}
          label="Parceiros"
          value={partners.count ?? 0}
        />
        <Stat
          icon={<Tags className="w-5 h-5" />}
          label="Categorias"
          value={categories.count ?? 0}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border-subtle p-6">
          <h2 className="text-[15px] font-bold text-text-strong">
            Comece por aqui
          </h2>
          <p className="text-[13px] text-text-muted mt-1">
            Para alimentar o site, cadastre primeiro os parceiros e categorias,
            e depois os passeios.
          </p>
          <ul className="mt-4 space-y-2 text-[13.5px]">
            <Step
              href="/admin/parceiros"
              label="Cadastrar parceiros"
              done={(partners.count ?? 0) > 0}
            />
            <Step
              href="/admin/categorias"
              label="Verificar categorias"
              done={(categories.count ?? 0) > 0}
            />
            <Step
              href="/admin/passeios"
              label="Adicionar passeios e links de afiliado"
              done={total > 0}
            />
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-border-subtle p-6">
          <h2 className="text-[15px] font-bold text-text-strong">Atalhos</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <ActionLink href="/admin/passeios/novo" label="Adicionar passeio" />
            <ActionLink href="/admin/blog/novo" label="Nova postagem" />
            <ActionLink href="/admin/destinos" label="Destinos" />
            <ActionLink href="/admin/parceiros" label="Parceiros" />
            <ActionLink href="/admin/categorias" label="Categorias" />
            <ActionLink href="/admin/blog" label="Gerenciar blog" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-5">
      <span className="grid place-items-center w-9 h-9 rounded-full bg-brand-yellow-soft text-navy-700">
        {icon}
      </span>
      <p className="mt-3 text-[12.5px] text-text-muted">{label}</p>
      <p className="text-[28px] font-extrabold text-text-strong leading-tight">
        {value}
      </p>
      {hint ? (
        <p className="text-[11.5px] text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

function Step({ href, label, done }: { href: string; label: string; done: boolean }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-2 text-text-strong hover:text-navy-700"
      >
        <span
          className={`grid place-items-center w-5 h-5 rounded-full text-[11px] ${
            done ? "bg-success text-white" : "bg-surface-alt text-text-muted border border-border-subtle"
          }`}
        >
          {done ? "✓" : ""}
        </span>
        {label}
      </Link>
    </li>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-border-subtle p-3 text-[13px] font-semibold text-text-strong hover:bg-surface-alt"
    >
      {label}
    </Link>
  );
}
