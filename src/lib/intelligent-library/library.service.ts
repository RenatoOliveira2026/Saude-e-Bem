import { fetchPublishedLibraryItemsWithFallback } from "@/lib/supabase/services/library-items.public";
import { getContentEngineLibraryCatalog } from "@/lib/content-engine/mappers";
import { fetchLibraryItemSlugsFromDb } from "@/lib/supabase/services/library-items.public";
import {
  getCatalogItemBySlug,
  getFeaturedCatalogItem,
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
  return fetchPublishedLibraryItemsWithFallback(async () =>
    getContentEngineLibraryCatalog(),
  );
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

export async function fetchIntelligentLibrarySlugs(): Promise<string[]> {
  try {
    const fromDb = await fetchLibraryItemSlugsFromDb();
    if (fromDb.length > 0) return fromDb;
  } catch {
    /* fallback abaixo */
  }
  return getContentEngineLibraryCatalog().map((item) => item.slug);
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
    assets.affiliateUrl ??
    (assets.storagePath
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")}/storage/v1/object/public/library/${assets.storagePath.replace(/^library\//, "")}`
      : undefined)
  );
}
