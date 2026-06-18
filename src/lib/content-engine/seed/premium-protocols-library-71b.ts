import generated from "./premium-protocols-library-71b.generated.json";
import type { LibraryItem } from "@/lib/intelligent-library/library.types";

type LibrarySeedRow = (typeof generated)[number];

/** 10 itens de biblioteca (protocolos premium) — Fase 7.1B */
export const PREMIUM_PROTOCOL_LIBRARY_71B: LibrarySeedRow[] = generated;

export function mapPremiumLibrarySeedToItem(seed: LibrarySeedRow): LibraryItem {
  return {
    id: seed.id,
    slug: seed.slug,
    title: seed.title,
    description: seed.description,
    longDescription: seed.long_description,
    category: seed.category_label,
    type: "protocolo",
    isPremium: seed.is_premium,
    image: seed.image_url,
    estimatedReadTime: seed.estimated_read_time,
    featured: seed.featured,
    seoTitle: seed.seo_title,
    seoDescription: seed.seo_description,
    seoKeywords: seed.seo_keywords,
    ogImageUrl: seed.og_image_url,
    assets: seed.assets as LibraryItem["assets"],
  };
}
