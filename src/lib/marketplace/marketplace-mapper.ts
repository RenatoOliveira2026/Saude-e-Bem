import type { PublicAffiliateSummary } from "@/lib/affiliates/types";
import { AFFILIATE_CATEGORY_OPTIONS } from "@/lib/affiliates/categories";
import type { MarketplaceItem } from "./marketplace.types";

function categoryLabel(category: string): string {
  const match = AFFILIATE_CATEGORY_OPTIONS.find(
    (opt) => opt.value === category || opt.label.toLowerCase() === category.toLowerCase(),
  );
  return match?.label ?? category;
}

export function affiliateToMarketplaceItem(
  affiliate: PublicAffiliateSummary,
): MarketplaceItem {
  return {
    id: `affiliate-${affiliate.id}`,
    slug: affiliate.slug,
    title: affiliate.title,
    description: affiliate.description,
    category: affiliate.category,
    categoryLabel: categoryLabel(affiliate.category),
    productType: affiliate.productType,
    fulfillment: "affiliate",
    isPremium: false,
    imageUrl: affiliate.imageUrl,
    currentPrice: affiliate.currentPrice,
    oldPrice: affiliate.oldPrice,
    installments: affiliate.installments,
    featured: affiliate.featured,
    editorChoice: affiliate.editorChoice,
    affiliateSlug: affiliate.slug,
    healthTags: inferHealthTagsFromCategory(affiliate.category),
  };
}

function inferHealthTagsFromCategory(
  category: string,
): MarketplaceItem["healthTags"] {
  const key = category.toLowerCase();
  if (key.includes("sono")) return ["habits"];
  if (key.includes("energia")) return ["metabolism", "habits"];
  if (key.includes("longev")) return ["cardiometabolic", "habits"];
  if (key.includes("nutri") || key.includes("aliment")) return ["protein", "bmi"];
  if (key.includes("menopausa")) return ["cardiometabolic", "habits"];
  if (key.includes("mente")) return ["habits"];
  if (key.includes("intestinal")) return ["habits", "protein"];
  return ["habits"];
}

export function mergeMarketplaceCatalog(
  mockItems: MarketplaceItem[],
  affiliateItems: MarketplaceItem[],
): MarketplaceItem[] {
  const affiliateSlugs = new Set(affiliateItems.map((item) => item.slug));
  const mockWithoutAffiliateDupes = mockItems.filter(
    (item) =>
      item.fulfillment !== "affiliate" || !affiliateSlugs.has(item.slug),
  );
  return [...affiliateItems, ...mockWithoutAffiliateDupes].sort((a, b) => {
    const score = (item: MarketplaceItem) =>
      (item.editorChoice ? 4 : 0) +
      (item.featured ? 2 : 0) +
      (item.fulfillment === "affiliate" ? 1 : 0);
    return score(b) - score(a);
  });
}
