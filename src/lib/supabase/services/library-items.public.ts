import { mapLibraryItemRow } from "@/lib/supabase/mappers/library-items";
import { createClient } from "@/lib/supabase/server";
import { withSupabaseListFallback } from "./fallback";

export async function fetchPublishedLibraryItemsFromDb() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("library_items")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("title", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapLibraryItemRow);
}

export async function fetchPublishedLibraryItemsWithFallback(
  mockFallback: () => Promise<import("@/lib/intelligent-library/library.types").LibraryItem[]>,
) {
  return withSupabaseListFallback(
    fetchPublishedLibraryItemsFromDb,
    mockFallback,
    "library_items",
  );
}

export async function fetchLibraryItemSlugsFromDb(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("library_items")
    .select("slug")
    .eq("status", "published");
  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}
