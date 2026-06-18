import type { LibraryItem } from "@/lib/intelligent-library/library.types";
import type { MarketplaceItem } from "@/lib/marketplace/marketplace.types";
import type { ScoreCriterionId } from "@/lib/recommendations/recommendation-types";
import type { ContentEngineMarketplaceFulfillment } from "./constants";
import { CONTENT_ENGINE_LIBRARY_ITEMS } from "./seed/library-items";
import {
  mapPremiumLibrarySeedToItem,
  PREMIUM_PROTOCOL_LIBRARY_71B,
} from "./seed/premium-protocols-library-71b";
import { CONTENT_ENGINE_MARKETPLACE_PRODUCTS } from "./seed/marketplace-products";

type LibrarySeed = (typeof CONTENT_ENGINE_LIBRARY_ITEMS)[number];
type MarketplaceSeed = (typeof CONTENT_ENGINE_MARKETPLACE_PRODUCTS)[number];

export function mapSeedToLibraryItem(seed: LibrarySeed): LibraryItem {
  return {
    id: seed.id,
    slug: seed.slug,
    title: seed.title,
    description: seed.description,
    longDescription: seed.long_description,
    category: seed.category_label,
    type: seed.item_type as LibraryItem["type"],
    isPremium: seed.is_premium,
    image: seed.image_url,
    estimatedReadTime: seed.estimated_read_time,
    featured: seed.featured,
    seoTitle: seed.seo_title,
    seoDescription: seed.seo_description,
    seoKeywords: seed.seo_keywords,
    ogImageUrl: seed.og_image_url,
    assets: seed.assets,
  };
}

export function mapSeedToMarketplaceItem(seed: MarketplaceSeed): MarketplaceItem {
  const price = seed as MarketplaceSeed & {
    current_price?: number;
    old_price?: number;
    installments?: string;
    library_slug?: string;
    affiliate_slug?: string;
    image_url?: string;
  };
  return {
    id: seed.id,
    slug: seed.slug,
    title: seed.title,
    description: seed.description,
    category: seed.category,
    categoryLabel: seed.category_label,
    productType: seed.product_type,
    fulfillment: seed.fulfillment as ContentEngineMarketplaceFulfillment,
    isPremium: seed.is_premium,
    imageUrl: price.image_url ?? seed.og_image_url,
    currentPrice: price.current_price ?? null,
    oldPrice: price.old_price ?? null,
    installments: price.installments ?? null,
    featured: seed.featured,
    editorChoice: seed.editor_choice,
    librarySlug: price.library_slug,
    affiliateSlug: price.affiliate_slug,
    healthTags: [...(seed.health_tags ?? [])] as ScoreCriterionId[],
    seoTitle: seed.seo_title,
    seoDescription: seed.seo_description,
    seoKeywords: seed.seo_keywords,
    ogImageUrl: seed.og_image_url,
  };
}

export function getContentEngineLibraryCatalog(): LibraryItem[] {
  const premiumLibrary = PREMIUM_PROTOCOL_LIBRARY_71B.map(mapPremiumLibrarySeedToItem);
  return [...CONTENT_ENGINE_LIBRARY_ITEMS.map(mapSeedToLibraryItem), ...premiumLibrary];
}

export function getContentEngineMarketplaceCatalog(): MarketplaceItem[] {
  return CONTENT_ENGINE_MARKETPLACE_PRODUCTS.map(mapSeedToMarketplaceItem);
}
