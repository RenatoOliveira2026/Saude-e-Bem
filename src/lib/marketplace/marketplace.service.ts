import { fetchAllActiveAffiliateLinks } from "@/lib/supabase/services/affiliates.public";
import { MARKETPLACE_CATALOG, getCatalogItemBySlug } from "./marketplace-catalog";
import { filterMarketplaceItems } from "./marketplace-filters";
import {
  affiliateToMarketplaceItem,
  mergeMarketplaceCatalog,
} from "./marketplace-mapper";
import { resolveItemHref } from "./marketplace-matching";
import type {
  MarketplaceFilterId,
  MarketplaceItem,
  MarketplaceStats,
} from "./marketplace.types";

/**
 * Ponto único de leitura do marketplace.
 * Futuro: tabela `marketplace_products` + merge com afiliados e biblioteca.
 */
export async function fetchMarketplaceItems(): Promise<MarketplaceItem[]> {
  const affiliates = await fetchAllActiveAffiliateLinks();
  const affiliateItems = affiliates.map(affiliateToMarketplaceItem);
  return mergeMarketplaceCatalog(MARKETPLACE_CATALOG, affiliateItems);
}

export async function fetchMarketplaceItemBySlug(
  slug: string,
): Promise<MarketplaceItem | undefined> {
  const items = await fetchMarketplaceItems();
  return items.find((item) => item.slug === slug) ?? getCatalogItemBySlug(slug);
}

export function getMarketplaceSlugs(): string[] {
  return MARKETPLACE_CATALOG.map((item) => item.slug);
}

export function filterMarketplaceCatalog(
  items: MarketplaceItem[],
  filterId: MarketplaceFilterId,
): MarketplaceItem[] {
  return filterMarketplaceItems(items, filterId);
}

export function computeMarketplaceStats(items: MarketplaceItem[]): MarketplaceStats {
  return {
    total: items.length,
    digital: items.filter((i) => i.fulfillment === "digital").length,
    affiliate: items.filter((i) => i.fulfillment === "affiliate").length,
    premium: items.filter((i) => i.isPremium).length,
  };
}

export function getMarketplaceItemHref(item: MarketplaceItem): string {
  return resolveItemHref(item);
}
