"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import {
  buildRezdyWidgetUrl,
  getRezdyConfig,
  listAllRezdyProducts,
  type RezdyProduct,
} from "@/lib/rezdy";

export type TourFormState = { error?: string; ok?: boolean };

function parseList(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseGallery(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * If the user pastes the full Rezdy/FareHarbor/Pluralo snippet (with <script>
 * and <iframe>) into the URL field, we automatically extract the iframe `src`.
 * Returns the cleaned URL.
 */
function extractWidgetUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const match = trimmed.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  if (match) return match[1];
  return trimmed;
}

function numberOrNull(v: FormDataEntryValue | null): number | null {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

async function requireAdmin() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");
  return { supabase, user };
}

export async function upsertTour(_prev: TourFormState, formData: FormData): Promise<TourFormState> {
  try {
    const { supabase } = await requireAdmin();
    const id = formData.get("id") ? String(formData.get("id")) : null;
    const title = String(formData.get("title") ?? "").trim();
    if (!title) return { error: "Título obrigatório" };

    const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
    const widgetUrl = extractWidgetUrl(String(formData.get("booking_widget_url") ?? ""));
    const widgetHtml = String(formData.get("booking_widget_html") ?? "").trim();
    const affiliateUrl = String(formData.get("affiliate_url") ?? "").trim();
    const coverImage = String(formData.get("cover_image") ?? "").trim();



    const tourMode = formData.get("tour_mode") === "complete" ? "complete" : "widget";

    const payload = {
      title,
      slug,
      tour_mode: tourMode,
      short_description: String(formData.get("short_description") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
      cover_image: coverImage || null,
      gallery: parseGallery(formData.get("gallery")),
      price_brl: numberOrNull(formData.get("price_brl")),
      price_from_brl: numberOrNull(formData.get("price_from_brl")),
      duration: String(formData.get("duration") ?? "") || null,
      rating: numberOrNull(formData.get("rating")),
      reviews_count: Number(formData.get("reviews_count") ?? 0),
      destination_id: formData.get("destination_id")
        ? String(formData.get("destination_id"))
        : null,
      category_id: formData.get("category_id")
        ? String(formData.get("category_id"))
        : null,
      partner_id: formData.get("partner_id")
        ? String(formData.get("partner_id"))
        : null,
      affiliate_url: affiliateUrl || null,
      booking_widget_url: widgetUrl || null,
      booking_widget_html: widgetHtml || null,
      meeting_point: String(formData.get("meeting_point") ?? "") || null,
      included: parseList(formData.get("included")),
      not_included: parseList(formData.get("not_included")),
      highlights: parseList(formData.get("highlights")),
      free_cancellation: formData.get("free_cancellation") === "on",
      is_featured: formData.get("is_featured") === "on",
      is_published: formData.get("is_published") === "on",
      hide_price: formData.get("hide_price") === "on",
      badge: String(formData.get("badge") ?? "") || null,
      important_info: String(formData.get("important_info") ?? "") || null,
      what_to_bring: String(formData.get("what_to_bring") ?? "") || null,
      tips: String(formData.get("tips") ?? "") || null,
      languages: parseList(formData.get("languages")),
    };

    if (id) {
      const { error } = await supabase.from("tours").update(payload).eq("id", id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("tours").insert(payload);
      if (error) return { error: error.message };
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro inesperado" };
  }

  revalidatePath("/admin/passeios");
  revalidatePath("/");
  revalidatePath("/atividades");
  redirect("/admin/passeios");
}

export async function deleteTour(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("tours").delete().eq("id", id);
  revalidatePath("/admin/passeios");
  revalidatePath("/");
  revalidatePath("/atividades");
}

export async function togglePublish(id: string, next: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("tours").update({ is_published: next }).eq("id", id);
  revalidatePath("/admin/passeios");
  revalidatePath("/");
  revalidatePath("/atividades");
}

export type RezdyImportResult = {
  ok: boolean;
  error?: string;
  created?: number;
  updated?: number;
  skipped?: number;
  totalFromRezdy?: number;
};

function rezdyProductToTourPayload(p: RezdyProduct, subdomain?: string) {
  const images = (p.images ?? [])
    .map((img) => img.largeSizeUrl || img.mediumSizeUrl || img.itemUrl)
    .filter(Boolean);

  const widgetUrl = buildRezdyWidgetUrl(p, subdomain);

  const durationMin = p.durationMinutes ?? 0;
  const duration =
    durationMin >= 60
      ? `${Math.round(durationMin / 60)}h${durationMin % 60 ? ` ${durationMin % 60}min` : ""}`
      : durationMin > 0
        ? `${durationMin} min`
        : null;

  return {
    slug: slugify(p.name),
    title: p.name,
    short_description: p.shortDescription || null,
    description: p.description || null,
    cover_image: images[0] ?? null,
    gallery: images.slice(1),
    price_brl: null as number | null,
    price_from_brl: p.advertisedPrice ?? null,
    duration,
    booking_widget_url: widgetUrl,
    booking_widget_html: null,
    affiliate_url: null,
    is_published: true,
    free_cancellation: true,
    reviews_count: 0,
    rezdy_product_code: p.productCode,
    rezdy_updated_at: p.dateUpdated ?? null,
  };
}

export async function importFromRezdy(): Promise<RezdyImportResult> {
  try {
    const { supabase } = await requireAdmin();
    const config = getRezdyConfig();
    if (!config) {
      return {
        ok: false,
        error:
          "REZDY_API_KEY não configurada. Defina a variável de ambiente na Vercel.",
      };
    }

    const products = await listAllRezdyProducts(config);
    const subdomain =
      process.env.REZDY_SUBDOMAIN ||
      (config.apiKey === "5f4b36ff169047a4a5682cba7e07fea4"
        ? undefined
        : "yourguidealgarve");

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const p of products) {
      if (!p.productCode || !p.name) {
        skipped++;
        continue;
      }

      const payload = rezdyProductToTourPayload(p, subdomain);

      // Match by Rezdy product code first, then fall back to slug.
      const { data: existing } = await supabase
        .from("tours")
        .select("id")
        .or(`rezdy_product_code.eq.${p.productCode},slug.eq.${payload.slug}`)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await supabase
          .from("tours")
          .update(payload)
          .eq("id", existing.id);
        if (error) {
          skipped++;
          continue;
        }
        updated++;
      } else {
        const { error } = await supabase.from("tours").insert(payload);
        if (error) {
          skipped++;
          continue;
        }
        created++;
      }
    }

    revalidatePath("/admin/passeios");
    revalidatePath("/");
    revalidatePath("/atividades");

    return {
      ok: true,
      created,
      updated,
      skipped,
      totalFromRezdy: products.length,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erro inesperado",
    };
  }
}
