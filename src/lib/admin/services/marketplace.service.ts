import { mapMarketplaceProductRow } from "@/lib/supabase/mappers/marketplace-products";
import type { ContentPublishStatus } from "@/lib/admin/cms/form-utils";
import { createClient } from "@/lib/supabase/server";
import type { MarketplaceProductRow } from "@/lib/supabase/types";

export type MarketplaceProductAdminRecord = MarketplaceProductRow;

export type MarketplaceProductAdminInput = {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  productType: string;
  fulfillment: MarketplaceProductRow["fulfillment"];
  isPremium: boolean;
  currentPrice: number | null;
  oldPrice: number | null;
  installments: string | null;
  featured: boolean;
  editorChoice: boolean;
  librarySlug: string | null;
  affiliateSlug: string | null;
  status: ContentPublishStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  ogImageUrl: string | null;
};

function toDb(input: MarketplaceProductAdminInput) {
  return {
    slug: input.slug,
    title: input.title,
    description: input.description,
    category: input.category,
    category_label: input.categoryLabel,
    product_type: input.productType,
    fulfillment: input.fulfillment,
    is_premium: input.isPremium,
    current_price: input.currentPrice,
    old_price: input.oldPrice,
    installments: input.installments,
    featured: input.featured,
    editor_choice: input.editorChoice,
    library_slug: input.librarySlug,
    affiliate_slug: input.affiliateSlug,
    health_tags: [],
    status: input.status,
    seo_title: input.seoTitle,
    seo_description: input.seoDescription,
    seo_keywords: input.seoKeywords,
    og_image_url: input.ogImageUrl,
  };
}

export async function adminListMarketplaceProducts(): Promise<MarketplaceProductAdminRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("marketplace_products")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminGetMarketplaceProduct(
  id: string,
): Promise<MarketplaceProductAdminRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("marketplace_products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function adminInsertMarketplaceProduct(
  input: MarketplaceProductAdminInput,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("marketplace_products")
    .insert(toDb(input))
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function adminUpdateMarketplaceProduct(
  id: string,
  input: MarketplaceProductAdminInput,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("marketplace_products")
    .update(toDb(input))
    .eq("id", id);
  if (error) throw error;
}

export async function adminDeleteMarketplaceProduct(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("marketplace_products").delete().eq("id", id);
  if (error) throw error;
}

export async function getMarketplaceProductAdminCounts(): Promise<{
  total: number;
  digital: number;
  affiliate: number;
  own: number;
}> {
  const items = await adminListMarketplaceProducts().catch(() => []);
  return {
    total: items.length,
    digital: items.filter((i) => i.fulfillment === "digital").length,
    affiliate: items.filter((i) => i.fulfillment === "affiliate").length,
    own: items.filter((i) => i.fulfillment === "own").length,
  };
}

export function marketplaceProductToDomain(row: MarketplaceProductAdminRecord) {
  return mapMarketplaceProductRow(row);
}
