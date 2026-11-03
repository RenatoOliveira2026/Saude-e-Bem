import { createClient } from "@/lib/supabase/server";
import { mapProtocolRow } from "@/lib/supabase/mappers/content";
import type { Protocol } from "@/lib/data/types";

/**
 * T-05 / S-04: listagens leem o catálogo público (`protocols_public`), que traz
 * todas as linhas publicadas com o corpo vazio nas premium. O corpo completo
 * de uma linha premium só vem da tabela, cuja política libera premium e admin.
 */
const CATALOG = "protocols_public" as const;

const PROTOCOL_COLUMNS =
  "id, slug, title, description, objective, long_description, cover_image_url, category, category_label, duration, level, benefits, steps, content, is_premium, featured, tag, participants, seo_title, seo_description, seo_keywords, og_image_url, status, created_at, updated_at";

export async function fetchProtocolsFromSupabase(): Promise<Protocol[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CATALOG)
    .select(PROTOCOL_COLUMNS)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("participants", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapProtocolRow);
}

export async function fetchProtocolBySlugFromSupabase(
  slug: string,
): Promise<Protocol | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CATALOG)
    .select(PROTOCOL_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  if (data.is_premium) {
    const { data: full, error: fullError } = await supabase
      .from("protocols")
      .select(PROTOCOL_COLUMNS)
      .eq("id", data.id)
      .maybeSingle();
    if (fullError) throw fullError;
    if (full) return mapProtocolRow(full);
  }

  return mapProtocolRow(data);
}

export async function fetchFeaturedProtocolFromSupabase(): Promise<Protocol | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CATALOG)
    .select(PROTOCOL_COLUMNS)
    .eq("status", "published")
    .eq("featured", true)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (data) return mapProtocolRow(data);

  const { data: fallback, error: fallbackError } = await supabase
    .from(CATALOG)
    .select(PROTOCOL_COLUMNS)
    .eq("status", "published")
    .order("participants", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fallbackError) throw fallbackError;
  return fallback ? mapProtocolRow(fallback) : null;
}

export async function fetchProtocolSlugsFromSupabase(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CATALOG)
    .select("slug")
    .eq("status", "published");

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}
