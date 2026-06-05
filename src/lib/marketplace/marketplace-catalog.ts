import { getContentEngineMarketplaceCatalog } from "@/lib/content-engine/mappers";
import type { MarketplaceItem } from "./marketplace.types";

/** Catálogo local — espelha seeds do Content Engine (Fase 5.0). */
export const MARKETPLACE_CATALOG: MarketplaceItem[] =
  getContentEngineMarketplaceCatalog();

export function getCatalogItemBySlug(slug: string): MarketplaceItem | undefined {
  return MARKETPLACE_CATALOG.find((item) => item.slug === slug);
}
