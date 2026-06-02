import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { translateText, translateLines } from "@/lib/translate";
import { translateBlocks } from "@/lib/translate-blocks";
import type { Block } from "@/lib/blog-blocks";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { data: adminRow } = await supabase
    .from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!adminRow) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  if (!process.env.DEEPL_API_KEY) {
    return NextResponse.json({ error: "DEEPL_API_KEY não configurada no servidor. Adiciona a variável de ambiente no Vercel." }, { status: 500 });
  }

  // Quick connectivity test first
  try {
    await translateText("test", "PT");
  } catch (e) {
    return NextResponse.json({ error: `DeepL não está a responder: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 });
  }

  const errors: string[] = [];
  const results = { tours: 0, blog: 0, faqs: 0 };

  // ─── Tours (só title + short_description — rápido) ───────────────────────
  const { data: tours } = await supabase
    .from("tours")
    .select("id, title, short_description, description, highlights, title_pt, title_fr");

  for (const tour of tours ?? []) {
    if (tour.title_pt && tour.title_fr) continue;
    try {
      const update: Record<string, unknown> = {};
      for (const lang of (["PT", "FR"] as const)) {
        const k = lang === "PT" ? "pt" : "fr";
        if (lang === "PT" && tour.title_pt) continue;
        if (lang === "FR" && tour.title_fr) continue;
        const hl: string[] = Array.isArray(tour.highlights) ? tour.highlights.filter(Boolean) : [];
        const [t1, t2, t3, t4] = await Promise.all([
          tour.title             ? translateText(tour.title,             lang).then(r => r.text) : Promise.resolve(""),
          tour.short_description ? translateText(tour.short_description, lang).then(r => r.text) : Promise.resolve(""),
          tour.description       ? translateText(tour.description,       lang).then(r => r.text) : Promise.resolve(""),
          hl.length              ? translateLines(hl, lang)                                       : Promise.resolve([]),
        ]);
        if (t1) update[`title_${k}`]             = t1;
        if (t2) update[`short_description_${k}`] = t2;
        if (t3) update[`description_${k}`]       = t3;
        if ((t4 as string[]).length) update[`highlights_${k}`] = t4;
      }
      if (Object.keys(update).length) {
        await supabase.from("tours").update(update).eq("id", tour.id);
        results.tours++;
      }
    } catch (e) {
      errors.push(`Tour ${tour.id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // ─── Blog posts ───────────────────────────────────────────────────────────
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, excerpt, content, title_pt, title_fr");

  for (const post of posts ?? []) {
    if (post.title_pt && post.title_fr) continue;
    try {
      const update: Record<string, unknown> = {};
      for (const lang of (["PT", "FR"] as const)) {
        const k = lang === "PT" ? "pt" : "fr";
        if (lang === "PT" && post.title_pt) continue;
        if (lang === "FR" && post.title_fr) continue;
        const [t1, t2, t3] = await Promise.all([
          translateText(post.title, lang).then(r => r.text),
          post.excerpt ? translateText(post.excerpt, lang).then(r => r.text) : Promise.resolve(""),
          translateBlocks(post.content as Block[], lang),
        ]);
        update[`title_${k}`]   = t1;
        if (t2) update[`excerpt_${k}`] = t2;
        update[`content_${k}`] = t3;
      }
      if (Object.keys(update).length) {
        await supabase.from("blog_posts").update(update).eq("id", post.id);
        results.blog++;
      }
    } catch (e) {
      errors.push(`Blog ${post.id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // ─── FAQs ─────────────────────────────────────────────────────────────────
  const { data: faqs } = await supabase
    .from("faqs")
    .select("id, question, answer, question_pt, question_fr");

  for (const faq of faqs ?? []) {
    if (faq.question_pt && faq.question_fr) continue;
    try {
      const update: Record<string, unknown> = {};
      for (const lang of (["PT", "FR"] as const)) {
        const k = lang === "PT" ? "pt" : "fr";
        if (lang === "PT" && faq.question_pt) continue;
        if (lang === "FR" && faq.question_fr) continue;
        const [q, a] = await Promise.all([
          translateText(faq.question, lang).then(r => r.text),
          translateText(faq.answer,   lang).then(r => r.text),
        ]);
        update[`question_${k}`] = q;
        update[`answer_${k}`]   = a;
      }
      if (Object.keys(update).length) {
        await supabase.from("faqs").update(update).eq("id", faq.id);
        results.faqs++;
      }
    } catch (e) {
      errors.push(`FAQ ${faq.id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return NextResponse.json({ ok: errors.length === 0, translated: results, errors });
}
