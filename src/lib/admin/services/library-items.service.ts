import { mapLibraryItemRow } from "@/lib/supabase/mappers/library-items";
import type { ContentPublishStatus } from "@/lib/admin/cms/form-utils";
import { createClient } from "@/lib/supabase/server";
import type { LibraryItemRow } from "@/lib/supabase/types";

export type LibraryItemAdminRecord = LibraryItemRow;

export type LibraryItemAdminInput = {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  categoryLabel: string;
  itemType: string;
  tier: "free" | "premium";
  isPremium: boolean;
  estimatedReadTime: string;
  featured: boolean;
  status: ContentPublishStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  ogImageUrl: string | null;
};

function toDb(input: LibraryItemAdminInput) {
  return {
    slug: input.slug,
    title: input.title,
    description: input.description,
    long_description: input.longDescription,
    category: input.category,
    category_label: input.categoryLabel,
    item_type: input.itemType,
    tier: input.tier,
    is_premium: input.isPremium,
    estimated_read_time: input.estimatedReadTime,
    featured: input.featured,
    status: input.status,
    assets: {},
    seo_title: input.seoTitle,
    seo_description: input.seoDescription,
    seo_keywords: input.seoKeywords,
    og_image_url: input.ogImageUrl,
  };
}

export async function adminListLibraryItems(): Promise<LibraryItemAdminRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("library_items")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminGetLibraryItem(id: string): Promise<LibraryItemAdminRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("library_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function adminInsertLibraryItem(input: LibraryItemAdminInput): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("library_items")
    .insert(toDb(input))
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function adminUpdateLibraryItem(
  id: string,
  input: LibraryItemAdminInput,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("library_items").update(toDb(input)).eq("id", id);
  if (error) throw error;
}

export async function adminDeleteLibraryItem(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("library_items").delete().eq("id", id);
  if (error) throw error;
}

export async function getLibraryItemAdminCounts(): Promise<{
  total: number;
  free: number;
  premium: number;
}> {
  const items = await adminListLibraryItems().catch(() => []);
  return {
    total: items.length,
    free: items.filter((i) => !i.is_premium).length,
    premium: items.filter((i) => i.is_premium).length,
  };
}

export function libraryItemToDomain(row: LibraryItemAdminRecord) {
  return mapLibraryItemRow(row);
}
