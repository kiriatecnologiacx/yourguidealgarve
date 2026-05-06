import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PostForm } from "@/components/admin/post-form";

export const dynamic = "force-dynamic";

export default function AdminNewPostPage() {
  return (
    <div className="px-6 lg:px-10 py-8 max-w-3xl">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1 text-[13px] text-text-muted hover:text-text-strong"
      >
        <ChevronLeft className="w-4 h-4" /> Voltar
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold text-text-strong">Nova postagem</h1>
      <p className="text-[13.5px] text-text-muted">
        Crie um artigo para o blog do YouGuideAlgarve.
      </p>

      <div className="mt-6">
        <PostForm />
      </div>
    </div>
  );
}
