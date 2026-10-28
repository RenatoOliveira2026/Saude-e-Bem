import { fetchAllActiveAffiliateLinks } from "@/lib/supabase/services/affiliates.public";
import { fetchPublishedMarketplaceProductsWithFallback } from "@/lib/supabase/services/marketplace-products.public";
import { getContentEngineMarketplaceCatalog } from "@/lib/content-engine/mappers";
import { CLUB_PRICING } from "@/lib/payments/pricing";
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
 * Só entra no marketplace o que o visitante consegue de fato acessar ou comprar:
 * - afiliado: precisa de um link real e ativo em affiliate_links
 *   (os exemplos dos seeds não levam a loja nenhuma);
 * - produto próprio: fica de fora até existir checkout próprio para ele
 *   (hoje o botão "Comprar" levaria à assinatura do Clube).
 */
function isPublishable(item: MarketplaceItem, realAffiliateSlugs: Set<string>): boolean {
  if (item.fulfillment === "affiliate") {
    return Boolean(item.affiliateSlug && realAffiliateSlugs.has(item.affiliateSlug));
  }
  if (item.fulfillment === "own") return false;
  return true;
}

/** O preço do Clube vem da tabela oficial (pricing.ts), não do seed do banco. */
function withCurrentClubPrice(item: MarketplaceItem): MarketplaceItem {
  if (item.fulfillment !== "subscription") return item;
  return {
    ...item,
    currentPrice: CLUB_PRICING.premiumMonthly.amountCents / 100,
    oldPrice: null,
    installments: null,
  };
}

/** Ponto único de leitura do marketplace (banco + afiliados ativos). */
export async function fetchMarketplaceItems(): Promise<MarketplaceItem[]> {
  const [catalog, affiliates] = await Promise.all([
    fetchPublishedMarketplaceProductsWithFallback(async () =>
      getContentEngineMarketplaceCatalog(),
    ),
    fetchAllActiveAffiliateLinks(),
  ]);
  const affiliateItems = affiliates.map(affiliateToMarketplaceItem);
  const realAffiliateSlugs = new Set(affiliates.map((affiliate) => affiliate.slug));

  return mergeMarketplaceCatalog(catalog, affiliateItems)
    .filter((item) => isPublishable(item, realAffiliateSlugs))
    .map(withCurrentClubPrice);
}

export async function fetchMarketplaceItemBySlug(
  slug: string,
): Promise<MarketplaceItem | undefined> {
  const items = await fetchMarketplaceItems();
  return items.find((item) => item.slug === slug);
}

/** Slugs com página própria: os mesmos itens que aparecem na listagem. */
export async function fetchMarketplaceSlugs(): Promise<string[]> {
  try {
    const items = await fetchMarketplaceItems();
    return items.map((item) => item.slug);
  } catch {
    return [];
  }
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
    own: items.filter((i) => i.fulfillment === "own").length,
    premium: items.filter((i) => i.isPremium).length,
  };
}

export function getMarketplaceItemHref(item: MarketplaceItem): string {
  return resolveItemHref(item);
}
