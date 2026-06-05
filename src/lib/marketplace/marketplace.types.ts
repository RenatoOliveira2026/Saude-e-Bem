import type { ScoreCriterionId } from "@/lib/recommendations/recommendation-types";

/** Tipo de entrega do item no marketplace. */
export type MarketplaceFulfillment = "digital" | "affiliate" | "own" | "subscription";

export type MarketplaceFilterId =
  | "todos"
  | "digitais"
  | "afiliados"
  | "proprios"
  | "premium"
  | "ebooks";

export interface MarketplaceFilterOption {
  id: MarketplaceFilterId;
  label: string;
}

/** Item unificado do marketplace (Fase 4.9). */
export interface MarketplaceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  productType: string;
  fulfillment: MarketplaceFulfillment;
  isPremium: boolean;
  imageUrl?: string | null;
  currentPrice?: number | null;
  oldPrice?: number | null;
  installments?: string | null;
  featured?: boolean;
  editorChoice?: boolean;
  /** Slug em affiliate_links (fulfillment affiliate) */
  affiliateSlug?: string;
  /** Slug na biblioteca inteligente (fulfillment digital) */
  librarySlug?: string;
  /** Critérios do Score Saúde & Bem relacionados */
  healthTags?: ScoreCriterionId[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImageUrl?: string;
}

export interface RecommendedMarketplaceProduct {
  item: MarketplaceItem;
  reason: string;
  priority: number;
  matchScore: number;
  href: string;
}

export interface MarketplaceStats {
  total: number;
  digital: number;
  affiliate: number;
  own: number;
  premium: number;
}
