import { featuredResource, libraryResources } from "../library";
import type { LibraryResource } from "../types";
import {
  fetchEbookBySlugFromSupabase,
  fetchEbookSlugsFromSupabase,
  fetchEbooksFromSupabase,
  fetchFeaturedEbookFromSupabase,
} from "@/lib/supabase/services/ebooks.service";
import {
  withSupabaseListFallback,
  withSupabaseNullableFallback,
} from "@/lib/supabase/services/fallback";

const LABEL = "library.repository";

function publishedMocks(): LibraryResource[] {
  return libraryResources.filter((r) => r.status === "published");
}

export async function getLibraryResources(): Promise<LibraryResource[]> {
  return withSupabaseListFallback(
    fetchEbooksFromSupabase,
    publishedMocks,
    LABEL,
  );
}

export async function getLibraryResourceBySlug(
  slug: string,
): Promise<LibraryResource | null> {
  return withSupabaseNullableFallback(
    () => fetchEbookBySlugFromSupabase(slug),
    () =>
      libraryResources.find((r) => r.slug === slug && r.status === "published") ??
      null,
    LABEL,
  );
}

export async function getFeaturedLibraryResource(): Promise<LibraryResource | null> {
  return withSupabaseNullableFallback(
    fetchFeaturedEbookFromSupabase,
    () => featuredResource ?? publishedMocks()[0] ?? null,
    LABEL,
  );
}

export async function getLibraryResourcesByCategory(
  category: LibraryResource["category"] | "todos",
): Promise<LibraryResource[]> {
  const all = await getLibraryResources();
  if (category === "todos") return all;
  return all.filter((r) => r.category === category);
}

export async function getLibrarySlugs(): Promise<string[]> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const slugs = await fetchEbookSlugsFromSupabase();
      if (slugs.length > 0) return slugs;
    } catch {
      // fallback abaixo
    }
  }
  return libraryResources.map((r) => r.slug);
}

export { featuredResource, libraryResources };
