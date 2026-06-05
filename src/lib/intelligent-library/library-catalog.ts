import { getContentEngineLibraryCatalog } from "@/lib/content-engine/mappers";
import type { LibraryItem } from "./library.types";

/** Catálogo local — espelha seeds do Content Engine (Fase 5.0). */
export const INTELLIGENT_LIBRARY_CATALOG: LibraryItem[] =
  getContentEngineLibraryCatalog();

export function getCatalogItemBySlug(slug: string): LibraryItem | undefined {
  return INTELLIGENT_LIBRARY_CATALOG.find((item) => item.slug === slug);
}

export function getFeaturedCatalogItem(): LibraryItem | undefined {
  return (
    INTELLIGENT_LIBRARY_CATALOG.find((item) => item.featured) ??
    INTELLIGENT_LIBRARY_CATALOG[0]
  );
}
