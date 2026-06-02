import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { translateText } from "@/lib/translate";
import { translateBlocks } from "@/lib/translate-blocks";
import type { Block } from "@/lib/blog-blocks";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min for large datasets

export async function GET() {
  const supabase = await createSupabaseServer();

  // Auth + admin role check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!adminRow) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const results: Record<string, unknown> = { blog: [], faqs: [] };

  // ─── Blog posts ───────────────────────────────────────────────────────────
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, excerpt, content, title_pt, title_fr, content_pt, content_fr");

  for (const post of posts ?? []) {
    // Only translate missing fields
    const needsPt = !post.title_pt || !post.content_pt;
    const needsFr = !post.title_fr || !post.content_fr;
    if (!needsPt && !needsFr) continue;

    const update: Record<string, unknown> = {};

    try {
      const langs: Array<"PT" | "FR"> = [
        ...(needsPt ? (["PT"] as const) : []),
        ...(needsFr ? (["FR"] as const) : []),
      ];

      await Promise.all(langs.map(async (lang) => {
        const key = lang === "PT" ? "pt" : "fr";
        const [tTitle, tExcerpt, tContent] = await Promise.all([
          translateText(post.title,          lang).then(r => r.text).catch(() => null),
          post.excerpt ? translateText(post.excerpt, lang).then(r => r.text).catch(() => null) : Promise.resolve(null),
          translateBlocks(post.content as Block[], lang).catch(() => null),
        ]);
        if (tTitle)   update[`title_${key}`]   = tTitle;
        if (tExcerpt) update[`excerpt_${key}`] = tExcerpt;
        if (tContent) update[`content_${key}`] = tContent;
      }));

      if (Object.keys(update).length > 0) {
        await supabase.from("blog_posts").update(update).eq("id", post.id);
        (results.blog as string[]).push(post.id);
      }
    } catch (e) {
      console.error("blog translation error", post.id, e);
    }
  }

  // ─── FAQs ─────────────────────────────────────────────────────────────────
  const { data: faqs } = await supabase
    .from("faqs")
    .select("id, question, answer, question_pt, question_fr, answer_pt, answer_fr");

  for (const faq of faqs ?? []) {
    const needsPt = !faq.question_pt || !faq.answer_pt;
    const needsFr = !faq.question_fr || !faq.answer_fr;
    if (!needsPt && !needsFr) continue;

    const update: Record<string, unknown> = {};
    try {
      const langs: Array<"PT" | "FR"> = [
        ...(needsPt ? (["PT"] as const) : []),
        ...(needsFr ? (["FR"] as const) : []),
      ];
      await Promise.all(langs.map(async (lang) => {
        const key = lang === "PT" ? "pt" : "fr";
        const [tQ, tA] = await Promise.all([
          translateText(faq.question, lang).then(r => r.text).catch(() => null),
          translateText(faq.answer,   lang).then(r => r.text).catch(() => null),
        ]);
        if (tQ) update[`question_${key}`] = tQ;
        if (tA) update[`answer_${key}`]   = tA;
      }));

      if (Object.keys(update).length > 0) {
        await supabase.from("faqs").update(update).eq("id", faq.id);
        (results.faqs as string[]).push(faq.id);
      }
    } catch (e) {
      console.error("faq translation error", faq.id, e);
    }
  }

  return NextResponse.json({ ok: true, translated: results });
}
