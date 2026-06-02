import { createClient } from "@/lib/supabase/server";
import { mapEbookRow } from "@/lib/supabase/mappers/content";
import type { LibraryResource } from "@/lib/data/types";

const EBOOK_COLUMNS =
  "id, slug, title, description, long_description, cover_image_url, pdf_url, category, category_label, icon, format, pages, highlights, is_premium, downloads, featured, status, created_at, updated_at";

export async function fetchEbooksFromSupabase(): Promise<LibraryResource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ebooks")
    .select(EBOOK_COLUMNS)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("downloads", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapEbookRow);
}

export async function fetchEbookBySlugFromSupabase(
  slug: string,
): Promise<LibraryResource | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ebooks")
    .select(EBOOK_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data ? mapEbookRow(data) : null;
}

export async function fetchFeaturedEbookFromSupabase(): Promise<LibraryResource | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ebooks")
    .select(EBOOK_COLUMNS)
    .eq("status", "published")
    .eq("featured", true)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (data) return mapEbookRow(data);

  const { data: fallback, error: fallbackError } = await supabase
    .from("ebooks")
    .select(EBOOK_COLUMNS)
    .eq("status", "published")
    .order("downloads", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fallbackError) throw fallbackError;
  return fallback ? mapEbookRow(fallback) : null;
}

export async function fetchEbookSlugsFromSupabase(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ebooks")
    .select("slug")
    .eq("status", "published");

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}
