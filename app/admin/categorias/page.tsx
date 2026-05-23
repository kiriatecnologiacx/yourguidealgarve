import { createSupabaseServer } from "@/lib/supabase/server";
import { CategoryManager } from "@/components/admin/category-manager";

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
        Categorias exibidas na seção "Explore por categoria" da home.
      </p>
      <CategoryManager categories={categories} />
    </div>
  );
}
