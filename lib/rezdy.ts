/**
 * Rezdy Supplier API client.
 *
 * Docs: https://developers.rezdy.com/rezdyapi/index-supplier.html
 *
 * Auth: API key sent in `apiKey` header (or as ?apiKey= query string).
 * Rate limit: 100 requests/minute per key.
 *
 * Set REZDY_API_KEY in environment. The official demo key for staging
 * is `5f4b36ff169047a4a5682cba7e07fea4` — read-only against the staging
 * supplier `apispecificationdemosupplierdonotedit`.
 */

export type RezdyImage = {
  id: number;
  itemUrl: string;
  thumbnailUrl: string;
  mediumSizeUrl: string;
  largeSizeUrl: string;
};

export type RezdyPriceOption = {
  id: number;
  label: string;
  price: number;
  seatsUsed?: number;
  productCode?: string;
};

export type RezdyAddress = {
  addressLine?: string;
  postCode?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
};

export type RezdyProduct = {
  productCode: string;
  name: string;
  shortDescription?: string;
  description?: string;
  productType?: string;
  advertisedPrice?: number;
  currency?: string;
  durationMinutes?: number;
  images?: RezdyImage[];
  priceOptions?: RezdyPriceOption[];
  locationAddress?: RezdyAddress;
  supplierName?: string;
  supplierAlias?: string;
  bookingUrl?: string;
  unitLabel?: string;
  unitLabelPlural?: string;
  internalCode?: string;
  dateUpdated?: string;
  status?: string;
};

type ListResponse = {
  requestStatus: { success: boolean; error?: { errorMessage?: string } };
  products?: RezdyProduct[];
};

export type RezdyConfig = {
  apiKey: string;
  baseUrl?: string;
};

export function getRezdyConfig(): RezdyConfig | null {
  const apiKey = process.env.REZDY_API_KEY;
  if (!apiKey) return null;
  const baseUrl =
    process.env.REZDY_BASE_URL ||
    (apiKey === "5f4b36ff169047a4a5682cba7e07fea4"
      ? "https://api.rezdy-staging.com"
      : "https://api.rezdy.com");
  return { apiKey, baseUrl };
}

async function rezdyFetch<T>(
  config: RezdyConfig,
  path: string,
  searchParams?: Record<string, string | number>,
): Promise<T> {
  const url = new URL(`${config.baseUrl ?? "https://api.rezdy.com"}${path}`);
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url.toString(), {
    headers: {
      apiKey: config.apiKey,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Rezdy ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

/**
 * List all products for the configured supplier. The Rezdy API caps a single
 * request at 100; we paginate until exhausted.
 */
export async function listAllRezdyProducts(
  config: RezdyConfig,
): Promise<RezdyProduct[]> {
  const all: RezdyProduct[] = [];
  const limit = 100;
  let offset = 0;
  while (true) {
    const page = await rezdyFetch<ListResponse>(config, "/v1/products", {
      limit,
      offset,
    });
    if (!page.requestStatus?.success) {
      throw new Error(
        page.requestStatus?.error?.errorMessage || "Rezdy request failed",
      );
    }
    const products = page.products ?? [];
    all.push(...products);
    if (products.length < limit) break;
    offset += limit;
    // small safety cap to avoid infinite loop
    if (offset > 5000) break;
  }
  return all;
}

/**
 * Best widget URL for embedding in our booking sidebar. Prefers the
 * Rezdy `calendarWidget` form (narrow inline calendar that opens a modal
 * for checkout) — that's the one the supplier wants on each tour page.
 *
 * Example output:
 *   https://yourguidealgarve.rezdy.com/calendarWidget/459753?iframe=true
 *
 * `calendarWidget` expects a numeric product id. The Rezdy API doesn't
 * always expose that number, but the alphanumeric `productCode` (used in
 * the product URL) also works when passed to `calendarWidget`.
 */
export function buildRezdyWidgetUrl(
  product: RezdyProduct,
  fallbackSubdomain?: string,
): string | null {
  const alias = product.supplierAlias || fallbackSubdomain;
  if (!alias || !product.productCode) return null;
  return `https://${alias}.rezdy.com/calendarWidget/${product.productCode}?iframe=true`;
}
