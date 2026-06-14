/** Modelo canônico de produto afiliado — Fase 5.3 (mapeia affiliate_links / view affiliate_products) */
export interface AffiliateProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  category: string;
  affiliateUrl: string;
  partner: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface AffiliateProductClick {
  id: string;
  productId: string;
  userAgent: string | null;
  referrer: string | null;
  createdAt: string;
}
