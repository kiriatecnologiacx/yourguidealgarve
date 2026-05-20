import { createSupabaseServer } from "@/lib/supabase/server";
import type { Block } from "./blog-blocks";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: Block[];
  cover_image: string;
  author: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};

export async function listBlogPosts(limit?: number): Promise<BlogPost[]> {
  const supabase = await createSupabaseServer();
  let q = supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false });
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return (data ?? []) as BlogPost[];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  return (data as BlogPost | null) ?? null;
}
