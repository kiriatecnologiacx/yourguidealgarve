import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PostForm } from "@/components/admin/post-form";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminEditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="px-6 lg:px-10 py-8 max-w-3xl">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1 text-[13px] text-text-muted hover:text-text-strong"
      >
        <ChevronLeft className="w-4 h-4" /> Voltar
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold text-text-strong">Editar postagem</h1>
      <p className="text-[13.5px] text-text-muted">{data.title}</p>

      <div className="mt-6">
        <PostForm post={data} />
      </div>
    </div>
  );
}
