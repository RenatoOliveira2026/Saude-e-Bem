import { linesToArray, slugify } from "@/lib/admin/utils";
import type {
  AffiliateLinkRecord,
  PublicAffiliateProduct,
  PublicAffiliateSummary,
} from "@/lib/affiliates/types";
import type { AffiliateLinkRow } from "@/lib/supabase/types";

export function resolveAffiliateUrl(row: {
  affiliate_url?: string | null;
  url?: string;
}): string {
  return row.affiliate_url?.trim() || row.url?.trim() || "";
}

export function mapAffiliateRow(row: AffiliateLinkRow): AffiliateLinkRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug || slugify(row.title) || row.id,
    category: row.category,
    description: row.description,
    productType: row.product_type,
    brand: row.brand,
    producerName: row.producer_name,
    rating: row.rating != null ? Number(row.rating) : null,
    reviewsCount: row.reviews_count,
    editorChoice: row.editor_choice,
    benefits: row.benefits,
    targetAudience: row.target_audience,
    contraindications: row.contraindications,
    currentPrice: row.current_price != null ? Number(row.current_price) : null,
    oldPrice: row.old_price != null ? Number(row.old_price) : null,
    installments: row.installments,
    affiliatePlatform: row.affiliate_platform,
    affiliateUrl: resolveAffiliateUrl(row),
    officialUrl: row.official_url ?? "",
    commissionType: row.commission_type,
    commissionValue: row.commission_value,
    cookieDuration: row.cookie_duration,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    seoKeywords: row.seo_keywords,
    testimonial1: row.testimonial_1,
    testimonial2: row.testimonial_2,
    testimonial3: row.testimonial_3,
    imageUrl: row.image_url,
    videoUrl: row.video_url,
    active: row.active,
    featured: row.featured,
    createdAt: row.created_at,
  };
}

export function mapPublicSummary(row: AffiliateLinkRow): PublicAffiliateSummary {
  const mapped = mapAffiliateRow(row);
  return {
    id: mapped.id,
    slug: mapped.slug,
    title: mapped.title,
    category: mapped.category,
    description: mapped.description,
    productType: mapped.productType,
    brand: mapped.brand,
    imageUrl: mapped.imageUrl,
    featured: mapped.featured,
    editorChoice: mapped.editorChoice,
    rating: mapped.rating,
    reviewsCount: mapped.reviewsCount,
    currentPrice: mapped.currentPrice,
    oldPrice: mapped.oldPrice,
    installments: mapped.installments,
  };
}

export function mapPublicProduct(row: AffiliateLinkRow): PublicAffiliateProduct {
  const mapped = mapAffiliateRow(row);
  const testimonials = [mapped.testimonial1, mapped.testimonial2, mapped.testimonial3].filter(
    Boolean,
  );
  return {
    ...mapPublicSummary(row),
    producerName: mapped.producerName,
    benefits: linesToArray(mapped.benefits),
    targetAudience: mapped.targetAudience,
    contraindications: mapped.contraindications,
    videoUrl: mapped.videoUrl,
    testimonials,
    officialUrl: mapped.officialUrl || null,
    seoTitle: mapped.seoTitle,
    seoDescription: mapped.seoDescription,
  };
}

export function affiliateRowToDb(
  input: Partial<AffiliateLinkRecord> & Pick<AffiliateLinkRecord, "title" | "slug" | "category">,
): import("@/lib/supabase/types").Database["public"]["Tables"]["affiliate_links"]["Insert"] {
  return {
    title: input.title,
    slug: input.slug,
    category: input.category,
    description: input.description ?? "",
    product_type: input.productType ?? "outro",
    brand: input.brand ?? "",
    producer_name: input.producerName ?? "",
    rating: input.rating,
    reviews_count: input.reviewsCount ?? 0,
    editor_choice: input.editorChoice ?? false,
    benefits: input.benefits ?? "",
    target_audience: input.targetAudience ?? "",
    contraindications: input.contraindications ?? "",
    current_price: input.currentPrice,
    old_price: input.oldPrice,
    installments: input.installments ?? "",
    affiliate_platform: input.affiliatePlatform ?? "",
    affiliate_url: input.affiliateUrl,
    url: input.affiliateUrl,
    official_url: input.officialUrl ?? "",
    commission_type: input.commissionType ?? "",
    commission_value: input.commissionValue ?? "",
    cookie_duration: input.cookieDuration ?? "",
    seo_title: input.seoTitle,
    seo_description: input.seoDescription,
    seo_keywords: input.seoKeywords,
    testimonial_1: input.testimonial1 ?? "",
    testimonial_2: input.testimonial2 ?? "",
    testimonial_3: input.testimonial3 ?? "",
    image_url: input.imageUrl,
    video_url: input.videoUrl,
    active: input.active ?? true,
    featured: input.featured ?? false,
  };
}
