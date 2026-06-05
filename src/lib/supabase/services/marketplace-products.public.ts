import { mapMarketplaceProductRow } from "@/lib/supabase/mappers/marketplace-products";
import { createClient } from "@/lib/supabase/server";
import { withSupabaseListFallback } from "./fallback";

export async function fetchPublishedMarketplaceProductsFromDb() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("marketplace_products")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("editor_choice", { ascending: false })
    .order("title", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapMarketplaceProductRow);
}

export async function fetchPublishedMarketplaceProductsWithFallback(
  mockFallback: () => Promise<import("@/lib/marketplace/marketplace.types").MarketplaceItem[]>,
) {
  return withSupabaseListFallback(
    fetchPublishedMarketplaceProductsFromDb,
    mockFallback,
    "marketplace_products",
  );
}

export async function fetchMarketplaceProductSlugsFromDb(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("marketplace_products")
    .select("slug")
    .eq("status", "published");
  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}
