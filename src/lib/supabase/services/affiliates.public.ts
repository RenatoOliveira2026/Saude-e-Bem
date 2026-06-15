import {
  affiliateMatchesContentCategory,
  resolveAffiliateCategory,
} from "@/lib/affiliates/categories";
import {
  mapPublicProduct,
  mapPublicSummary,
} from "@/lib/affiliates/mappers";
import type {
  PublicAffiliateProduct,
  PublicAffiliateSummary,
} from "@/lib/affiliates/types";
import { createClient } from "@/lib/supabase/server";
import type { AffiliateLinkRow } from "@/lib/supabase/types";

export type { PublicAffiliateProduct, PublicAffiliateSummary };
/** @deprecated Use PublicAffiliateSummary */
export type PublicAffiliateLink = PublicAffiliateSummary;

const PUBLIC_SUMMARY_COLUMNS =
  "id, slug, title, category, short_description, description, product_type, brand, image_url, featured, editor_choice, rating, reviews_count, current_price, old_price, installments, benefits, url, affiliate_url, active, created_at" as const;

const PUBLIC_DETAIL_COLUMNS = `${PUBLIC_SUMMARY_COLUMNS}, producer_name, target_audience, contraindications, video_url, testimonial_1, testimonial_2, testimonial_3, official_url, seo_title, seo_description, seo_keywords` as const;

async function fetchActiveRows(
  filter?: { featuredOnly?: boolean },
): Promise<AffiliateLinkRow[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("affiliate_links")
      .select(PUBLIC_SUMMARY_COLUMNS)
      .eq("active", true)
      .order("editor_choice", { ascending: false })
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (filter?.featuredOnly) {
      query = query.eq("featured", true);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("[affiliates.public]", error.message);
      return [];
    }
    return (data ?? []) as AffiliateLinkRow[];
  } catch {
    return [];
  }
}

export async function fetchAllActiveAffiliateLinks(): Promise<PublicAffiliateSummary[]> {
  const rows = await fetchActiveRows();
  return rows.map(mapPublicSummary);
}

export async function fetchFeaturedAffiliateLinks(
  limit = 4,
): Promise<PublicAffiliateSummary[]> {
  const rows = await fetchActiveRows({ featuredOnly: true });
  return rows.slice(0, limit).map(mapPublicSummary);
}

export async function fetchActiveAffiliateBySlug(
  slug: string,
): Promise<PublicAffiliateProduct | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("affiliate_links")
      .select(PUBLIC_DETAIL_COLUMNS)
      .eq("active", true)
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      if (error) console.warn("[affiliates.public] slug", error.message);
      return null;
    }
    return mapPublicProduct(data as AffiliateLinkRow);
  } catch {
    return null;
  }
}

export async function fetchActiveAffiliateSlugs(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("affiliate_links")
      .select("slug")
      .eq("active", true);

    if (error) return [];
    return (data ?? []).map((row) => row.slug as string);
  } catch {
    return [];
  }
}

export async function fetchAffiliatesForContentCategory(
  contentCategory: string,
  contentCategoryLabel: string,
  kind: "blog" | "protocol",
  limit = 3,
): Promise<PublicAffiliateSummary[]> {
  const all = await fetchAllActiveAffiliateLinks();
  return all
    .filter((link) =>
      affiliateMatchesContentCategory(
        link.category,
        contentCategory,
        contentCategoryLabel,
        kind,
      ),
    )
    .slice(0, limit);
}

export async function fetchRelatedAffiliateProducts(
  category: string,
  excludeSlug: string,
  limit = 4,
): Promise<PublicAffiliateSummary[]> {
  const target = resolveAffiliateCategory(category);
  const all = await fetchAllActiveAffiliateLinks();
  return all
    .filter(
      (link) =>
        link.slug !== excludeSlug &&
        resolveAffiliateCategory(link.category) === target,
    )
    .slice(0, limit);
}
