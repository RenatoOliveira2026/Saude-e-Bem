import { parseContentBlocks } from "@/lib/admin/cms/content-blocks";
import generated from "./premium-protocols-71b.generated.json";
import type { ContentCategory, ContentLevel } from "@/lib/data/types";

export interface PremiumProtocolSeedRow {
  slug: string;
  title: string;
  description: string;
  objective: string;
  longDescription: string;
  category: string;
  category_label: string;
  duration: string;
  level: string;
  benefits: string[];
  steps: { title: string; description: string }[];
  is_premium: boolean;
  featured: boolean;
  tag?: string;
  participants: number;
  cover_image_url?: string;
  content: unknown[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image_url: string;
}

/** 10 protocolos premium — Fase 7.1B (gerado por npm run generate:premium-protocols) */
export const PREMIUM_PROTOCOLS_71B: PremiumProtocolSeedRow[] =
  generated as PremiumProtocolSeedRow[];

export function mapPremiumProtocolToMock(protocol: PremiumProtocolSeedRow, index: number) {
  return {
    id: `premium-71b-${index + 1}`,
    slug: protocol.slug,
    title: protocol.title,
    description: protocol.description,
    objective: protocol.objective,
    longDescription: protocol.longDescription,
    category: protocol.category as ContentCategory,
    categoryLabel: protocol.category_label,
    duration: protocol.duration,
    level: protocol.level as ContentLevel,
    benefits: protocol.benefits,
    steps: protocol.steps,
    isPremium: protocol.is_premium,
    featured: protocol.featured,
    tag: protocol.tag,
    participants: protocol.participants,
    coverImageUrl: protocol.cover_image_url,
    contentBlocks: parseContentBlocks(protocol.content),
    seoTitle: protocol.seo_title,
    seoDescription: protocol.seo_description,
    seoKeywords: protocol.seo_keywords,
    ogImageUrl: protocol.og_image_url,
    status: "published" as const,
  };
}
