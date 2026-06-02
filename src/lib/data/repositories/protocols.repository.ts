import { featuredProtocol, protocols } from "../protocols";
import type { ContentCategory, Protocol } from "../types";
import {
  fetchFeaturedProtocolFromSupabase,
  fetchProtocolBySlugFromSupabase,
  fetchProtocolSlugsFromSupabase,
  fetchProtocolsFromSupabase,
} from "@/lib/supabase/services/protocols.service";
import {
  withSupabaseListFallback,
  withSupabaseNullableFallback,
} from "@/lib/supabase/services/fallback";

const LABEL = "protocols.repository";

function publishedMocks(): Protocol[] {
  return protocols.filter((p) => p.status === "published");
}

export async function getProtocols(): Promise<Protocol[]> {
  return withSupabaseListFallback(
    fetchProtocolsFromSupabase,
    publishedMocks,
    LABEL,
  );
}

export async function getProtocolBySlug(slug: string): Promise<Protocol | null> {
  return withSupabaseNullableFallback(
    () => fetchProtocolBySlugFromSupabase(slug),
    () =>
      protocols.find((p) => p.slug === slug && p.status === "published") ?? null,
    LABEL,
  );
}

export async function getFeaturedProtocol(): Promise<Protocol | null> {
  return withSupabaseNullableFallback(
    fetchFeaturedProtocolFromSupabase,
    () => featuredProtocol ?? publishedMocks()[0] ?? null,
    LABEL,
  );
}

export async function getProtocolsByCategory(
  category: ContentCategory | "todos",
): Promise<Protocol[]> {
  const all = await getProtocols();
  if (category === "todos") return all;
  return all.filter((p) => p.category === category);
}

export async function getProtocolSlugs(): Promise<string[]> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const slugs = await fetchProtocolSlugsFromSupabase();
      if (slugs.length > 0) return slugs;
    } catch {
      // fallback abaixo
    }
  }
  return protocols.map((p) => p.slug);
}

export { featuredProtocol, protocols };
