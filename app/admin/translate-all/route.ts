import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { translateText, translateLines } from "@/lib/translate";
import { translateBlocks } from "@/lib/translate-blocks";
import type { Block } from "@/lib/blog-blocks";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET() {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adminRow } = await supabase
    .from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!adminRow) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!process.env.DEEPL_API_KEY) {
    return NextResponse.json({ error: "DEEPL_API_KEY não configurada no servidor." }, { status: 500 });
  }

  const results = { tours: [] as string[], blog: [] as string[], faqs: [] as string[] };

  // ─── Tours ────────────────────────────────────────────────────────────────
  const { data: tours } = await supabase
    .from("tours")
    .select("id, title, short_description, description, highlights, title_pt, title_fr");

  for (const tour of tours ?? []) {
    const needsPt = !tour.title_pt;
    const needsFr = !tour.title_fr;
    if (!needsPt && !needsFr) continue;

    const update: Record<string, unknown> = {};
    try {
      const langs: Array<"PT" | "FR"> = [
        ...(needsPt ? (["PT"] as const) : []),
        ...(needsFr ? (["FR"] as const) : []),
      ];
      await Promise.all(langs.map(async (lang) => {
        const k = lang === "PT" ? "pt" : "fr";
        const hl: string[] = Array.isArray(tour.highlights) ? tour.highlights.filter(Boolean) : [];
        const [tTitle, tShort, tDesc, tHl] = await Promise.all([
          tour.title            ? translateText(tour.title,            lang).then(r => r.text).catch(() => null) : Promise.resolve(null),
          tour.short_description? translateText(tour.short_description,lang).then(r => r.text).catch(() => null) : Promise.resolve(null),
          tour.description      ? translateText(tour.description,      lang).then(r => r.text).catch(() => null) : Promise.resolve(null),
          hl.length > 0         ? translateLines(hl, lang).catch(() => null)                                     : Promise.resolve(null),
        ]);
        if (tTitle) update[`title_${k}`]             = tTitle;
        if (tShort) update[`short_description_${k}`] = tShort;
        if (tDesc)  update[`description_${k}`]       = tDesc;
        if (tHl)    update[`highlights_${k}`]         = tHl;
      }));

      if (Object.keys(update).length > 0) {
        await supabase.from("tours").update(update).eq("id", tour.id);
        results.tours.push(tour.id);
      }
    } catch (e) {
      console.error("tour translation error", tour.id, e);
    }
  }

  // ─── Blog posts ───────────────────────────────────────────────────────────
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, excerpt, content, title_pt, title_fr, content_pt, content_fr");

  for (const post of posts ?? []) {
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
        const k = lang === "PT" ? "pt" : "fr";
        const [tTitle, tExcerpt, tContent] = await Promise.all([
          translateText(post.title, lang).then(r => r.text).catch(() => null),
          post.excerpt ? translateText(post.excerpt, lang).then(r => r.text).catch(() => null) : Promise.resolve(null),
          translateBlocks(post.content as Block[], lang).catch(() => null),
        ]);
        if (tTitle)   update[`title_${k}`]   = tTitle;
        if (tExcerpt) update[`excerpt_${k}`] = tExcerpt;
        if (tContent) update[`content_${k}`] = tContent;
      }));

      if (Object.keys(update).length > 0) {
        await supabase.from("blog_posts").update(update).eq("id", post.id);
        results.blog.push(post.id);
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
        const k = lang === "PT" ? "pt" : "fr";
        const [tQ, tA] = await Promise.all([
          translateText(faq.question, lang).then(r => r.text).catch(() => null),
          translateText(faq.answer,   lang).then(r => r.text).catch(() => null),
        ]);
        if (tQ) update[`question_${k}`] = tQ;
        if (tA) update[`answer_${k}`]   = tA;
      }));

      if (Object.keys(update).length > 0) {
        await supabase.from("faqs").update(update).eq("id", faq.id);
        results.faqs.push(faq.id);
      }
    } catch (e) {
      console.error("faq translation error", faq.id, e);
    }
  }

  return NextResponse.json({ ok: true, translated: results });
}
