import { createClient } from "@/lib/supabase/server";
import { mapProtocolRow } from "@/lib/supabase/mappers/content";
import type { Protocol } from "@/lib/data/types";

const PROTOCOL_COLUMNS =
  "id, slug, title, description, objective, long_description, cover_image_url, category, category_label, duration, level, benefits, steps, is_premium, featured, tag, participants, status, created_at, updated_at";

export async function fetchProtocolsFromSupabase(): Promise<Protocol[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("protocols")
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
    .from("protocols")
    .select(PROTOCOL_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data ? mapProtocolRow(data) : null;
}

export async function fetchFeaturedProtocolFromSupabase(): Promise<Protocol | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("protocols")
    .select(PROTOCOL_COLUMNS)
    .eq("status", "published")
    .eq("featured", true)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (data) return mapProtocolRow(data);

  const { data: fallback, error: fallbackError } = await supabase
    .from("protocols")
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
    .from("protocols")
    .select("slug")
    .eq("status", "published");

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}
