import type { LibraryItem } from "@/lib/intelligent-library/library.types";
import type { LibraryItemRow } from "@/lib/supabase/types";

export function mapLibraryItemRow(row: LibraryItemRow): LibraryItem {
  const assets =
    row.assets && typeof row.assets === "object" && !Array.isArray(row.assets)
      ? (row.assets as LibraryItem["assets"])
      : undefined;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    longDescription: row.long_description || row.description,
    category: row.category_label,
    type: row.item_type as LibraryItem["type"],
    isPremium: row.is_premium,
    image: row.image_url ?? row.og_image_url ?? undefined,
    estimatedReadTime: row.estimated_read_time,
    featured: row.featured,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    seoKeywords: row.seo_keywords ?? undefined,
    ogImageUrl: row.og_image_url ?? undefined,
    assets,
  };
}
