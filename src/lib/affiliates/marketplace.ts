import {
  AFFILIATE_CATEGORY_OPTIONS,
  getAffiliateCategoryLabel,
  resolveAffiliateCategory,
} from "@/lib/affiliates/categories";
import type { PublicAffiliateSummary } from "@/lib/affiliates/types";
import { getAffiliateClickReport } from "@/lib/supabase/services/affiliates.clicks";
import { fetchAllActiveAffiliateLinks } from "@/lib/supabase/services/affiliates.public";

export interface MarketplaceCategorySection {
  slug: string;
  label: string;
  links: PublicAffiliateSummary[];
}

export interface RecomendadosMarketplaceData {
  featured: PublicAffiliateSummary[];
  mostClicked: PublicAffiliateSummary[];
  newest: PublicAffiliateSummary[];
  categories: MarketplaceCategorySection[];
  all: PublicAffiliateSummary[];
}

function withClickCounts(
  links: PublicAffiliateSummary[],
  clicksByProductId: Record<string, number>,
): PublicAffiliateSummary[] {
  return links.map((link) => ({
    ...link,
    clickCount: clicksByProductId[link.id] ?? 0,
  }));
}

function sortByClicks(
  links: PublicAffiliateSummary[],
  clicksByProductId: Record<string, number>,
): PublicAffiliateSummary[] {
  return [...links].sort(
    (a, b) =>
      (clicksByProductId[b.id] ?? 0) - (clicksByProductId[a.id] ?? 0) ||
      b.createdAt.localeCompare(a.createdAt),
  );
}

export async function getRecomendadosMarketplaceData(): Promise<RecomendadosMarketplaceData> {
  const [allRaw, report] = await Promise.all([
    fetchAllActiveAffiliateLinks(),
    getAffiliateClickReport(30),
  ]);

  const all = withClickCounts(allRaw, report.clicksByProductId);
  const featured = all.filter((link) => link.featured).slice(0, 8);
  const mostClicked = sortByClicks(all, report.clicksByProductId)
    .filter((link) => (link.clickCount ?? 0) > 0)
    .slice(0, 8);

  const newest = [...all]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);

  const categories = AFFILIATE_CATEGORY_OPTIONS.map((option) => ({
    slug: option.value,
    label: option.label,
    links: all
      .filter((link) => resolveAffiliateCategory(link.category) === option.value)
      .slice(0, 4),
  })).filter((section) => section.links.length > 0);

  return {
    featured,
    mostClicked: mostClicked.length > 0 ? mostClicked : featured.slice(0, 4),
    newest,
    categories,
    all,
  };
}

export function getCategoryLabel(category: string): string {
  return getAffiliateCategoryLabel(category);
}
