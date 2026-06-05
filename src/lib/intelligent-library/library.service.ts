import {
  getCatalogItemBySlug,
  getFeaturedCatalogItem,
  INTELLIGENT_LIBRARY_CATALOG,
} from "./library-catalog";
import { filterLibraryItems } from "./library-filters";
import type {
  LibraryCatalogStats,
  LibraryFilterId,
  LibraryItem,
} from "./library.types";

/**
 * Ponto único de leitura do catálogo.
 * Futuro: `fetchLibraryFromSupabase()` com fallback para mock local.
 */
export async function fetchIntelligentLibraryItems(): Promise<LibraryItem[]> {
  // TODO Fase 5+: substituir por Supabase quando `library_items` existir
  return INTELLIGENT_LIBRARY_CATALOG;
}

export async function fetchIntelligentLibraryItemBySlug(
  slug: string,
): Promise<LibraryItem | undefined> {
  const items = await fetchIntelligentLibraryItems();
  return items.find((item) => item.slug === slug) ?? getCatalogItemBySlug(slug);
}

export async function fetchFeaturedIntelligentLibraryItem(): Promise<
  LibraryItem | undefined
> {
  const items = await fetchIntelligentLibraryItems();
  return items.find((item) => item.featured) ?? getFeaturedCatalogItem();
}

export function getIntelligentLibrarySlugs(): string[] {
  return INTELLIGENT_LIBRARY_CATALOG.map((item) => item.slug);
}

export function filterIntelligentLibraryItems(
  items: LibraryItem[],
  filterId: LibraryFilterId,
): LibraryItem[] {
  return filterLibraryItems(items, filterId);
}

export function computeLibraryStats(items: LibraryItem[]): LibraryCatalogStats {
  const byType: LibraryCatalogStats["byType"] = {
    ebook: 0,
    protocolo: 0,
    video: 0,
    pdf: 0,
    affiliate: 0,
  };

  for (const item of items) {
    byType[item.type] += 1;
  }

  return {
    total: items.length,
    free: items.filter((i) => !i.isPremium).length,
    premium: items.filter((i) => i.isPremium).length,
    byType,
  };
}

/** Resolve URL pública quando Storage/afiliados estiverem configurados. */
export function resolveLibraryAssetUrl(item: LibraryItem): string | undefined {
  const { assets } = item;
  if (!assets) return undefined;
  return (
    assets.pdfUrl ??
    assets.ebookFileUrl ??
    assets.videoUrl ??
    assets.affiliateUrl
  );
}
