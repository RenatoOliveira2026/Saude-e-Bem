export const AFFILIATE_PRODUCT_TYPES = [
  { value: "suplemento", label: "Suplemento" },
  { value: "livro", label: "Livro" },
  { value: "curso", label: "Curso" },
  { value: "dispositivo", label: "Dispositivo" },
  { value: "app", label: "Aplicativo" },
  { value: "servico", label: "Serviço" },
  { value: "outro", label: "Outro" },
] as const;

export type AffiliateProductType = (typeof AFFILIATE_PRODUCT_TYPES)[number]["value"];

export const AFFILIATE_COMMISSION_TYPES = [
  { value: "percentual", label: "Percentual (%)" },
  { value: "fixo", label: "Valor fixo (R$)" },
  { value: "cpa", label: "CPA" },
  { value: "outro", label: "Outro" },
] as const;

export const AFFILIATE_PLATFORMS = [
  { value: "amazon", label: "Amazon Associados" },
  { value: "hotmart", label: "Hotmart" },
  { value: "kiwify", label: "Kiwify" },
  { value: "eduzz", label: "Eduzz" },
  { value: "braip", label: "Braip" },
  { value: "monetizze", label: "Monetizze" },
  { value: "outra", label: "Outra" },
] as const;

export interface AffiliateLinkRecord {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  productType: AffiliateProductType | string;
  brand: string;
  producerName: string;
  rating: number | null;
  reviewsCount: number;
  editorChoice: boolean;
  benefits: string;
  targetAudience: string;
  contraindications: string;
  currentPrice: number | null;
  oldPrice: number | null;
  installments: string;
  affiliatePlatform: string;
  affiliateUrl: string;
  officialUrl: string;
  commissionType: string;
  commissionValue: string;
  cookieDuration: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  testimonial1: string;
  testimonial2: string;
  testimonial3: string;
  imageUrl: string | null;
  videoUrl: string | null;
  active: boolean;
  featured: boolean;
  createdAt: string;
}

export type AffiliateLinkInput = Omit<AffiliateLinkRecord, "id" | "createdAt">;

export interface PublicAffiliateSummary {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  productType: string;
  brand: string;
  imageUrl: string | null;
  featured: boolean;
  editorChoice: boolean;
  rating: number | null;
  reviewsCount: number;
  currentPrice: number | null;
  oldPrice: number | null;
  installments: string;
  benefits: string[];
  createdAt: string;
  clickCount?: number;
}

export interface PublicAffiliateProduct extends PublicAffiliateSummary {
  producerName: string;
  benefits: string[];
  targetAudience: string;
  contraindications: string;
  videoUrl: string | null;
  testimonials: string[];
  officialUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
}

/** @deprecated Use PublicAffiliateSummary */
export type PublicAffiliateLink = PublicAffiliateSummary;
