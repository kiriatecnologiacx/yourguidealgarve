import { createSupabaseServer } from "@/lib/supabase/server";
import type { Block } from "./blog-blocks";
import type { Locale } from "./i18n";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  title_pt: string | null;
  title_fr: string | null;
  excerpt: string | null;
  excerpt_pt: string | null;
  excerpt_fr: string | null;
  content: Block[];
  content_pt: Block[] | null;
  content_fr: Block[] | null;
  cover_image: string;
  author: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};

export function localeBlogPost(post: BlogPost, locale: Locale) {
  return {
    ...post,
    title:   locale === "pt-PT" ? (post.title_pt   || post.title)   : locale === "fr" ? (post.title_fr   || post.title)   : post.title,
    excerpt: locale === "pt-PT" ? (post.excerpt_pt || post.excerpt) : locale === "fr" ? (post.excerpt_fr || post.excerpt) : post.excerpt,
    content: locale === "pt-PT" ? (post.content_pt || post.content) : locale === "fr" ? (post.content_fr || post.content) : post.content,
  };
}

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
