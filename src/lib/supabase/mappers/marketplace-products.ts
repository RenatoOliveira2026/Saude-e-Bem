import type { MarketplaceItem } from "@/lib/marketplace/marketplace.types";
import type { ScoreCriterionId } from "@/lib/recommendations/recommendation-types";
import type { MarketplaceProductRow } from "@/lib/supabase/types";

export function mapMarketplaceProductRow(row: MarketplaceProductRow): MarketplaceItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    categoryLabel: row.category_label,
    productType: row.product_type,
    fulfillment: row.fulfillment as MarketplaceItem["fulfillment"],
    isPremium: row.is_premium,
    imageUrl: row.image_url ?? row.og_image_url,
    currentPrice: row.current_price != null ? Number(row.current_price) : null,
    oldPrice: row.old_price != null ? Number(row.old_price) : null,
    installments: row.installments,
    featured: row.featured,
    editorChoice: row.editor_choice,
    librarySlug: row.library_slug ?? undefined,
    affiliateSlug: row.affiliate_slug ?? undefined,
    healthTags: (row.health_tags ?? []) as ScoreCriterionId[],
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    seoKeywords: row.seo_keywords ?? undefined,
    ogImageUrl: row.og_image_url ?? undefined,
  };
}
