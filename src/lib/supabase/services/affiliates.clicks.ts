import {
  estimateConversions,
  formatEstimatedConversionRate,
} from "@/lib/affiliates/conversion-estimate";
import { createClient } from "@/lib/supabase/server";

export interface AffiliateClickRecordInput {
  affiliateId: string;
  sourcePage: string;
  sourceType: string;
  userAgent?: string | null;
  referrer?: string | null;
}

export async function recordAffiliateClick(
  input: AffiliateClickRecordInput,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("affiliate_clicks").insert({
    affiliate_id: input.affiliateId,
    source_page: input.sourcePage.slice(0, 500),
    source_type: input.sourceType.slice(0, 64),
    user_agent: input.userAgent?.slice(0, 500) ?? null,
    referrer: input.referrer?.slice(0, 500) ?? null,
  });

  if (error) {
    console.warn("[affiliates.clicks]", error.message);
  }
}

export async function getAffiliateClickStats(): Promise<{
  total: number;
  last30Days: number;
}> {
  try {
    const supabase = await createClient();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalRes, recentRes] = await Promise.all([
      supabase.from("affiliate_clicks").select("id", { count: "exact", head: true }),
      supabase
        .from("affiliate_clicks")
        .select("id", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString()),
    ]);

    return {
      total: totalRes.count ?? 0,
      last30Days: recentRes.count ?? 0,
    };
  } catch {
    return { total: 0, last30Days: 0 };
  }
}

export interface AffiliateClickReport {
  totalClicks: number;
  clicksLast7Days: number;
  clicksLast30Days: number;
  topProducts: {
    id: string;
    title: string;
    slug: string;
    category: string;
    platform: string;
    clicks: number;
    estimatedConversions: number;
    estimatedConversionRate: string;
  }[];
  clicksByDay: { date: string; clicks: number }[];
  topCategories: { category: string; clicks: number }[];
  clicksByProductId: Record<string, number>;
  estimatedConversions: number;
  estimatedConversionRate: string;
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export async function getAffiliateClickReport(
  days = 30,
): Promise<AffiliateClickReport> {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: clicks, error: clicksError } = await supabase
    .from("affiliate_clicks")
    .select("id, affiliate_id, created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  if (clicksError) throw clicksError;

  const rows = clicks ?? [];
  const now = Date.now();
  const day7 = now - 7 * 24 * 60 * 60 * 1000;
  const day30 = now - 30 * 24 * 60 * 60 * 1000;

  const clicksByProductId: Record<string, number> = {};
  const clicksByCategory: Record<string, number> = {};
  const clicksByDayMap: Record<string, number> = {};

  let clicksLast7Days = 0;
  let clicksLast30Days = 0;

  for (const row of rows) {
    const created = new Date(row.created_at).getTime();
    if (created >= day7) clicksLast7Days += 1;
    if (created >= day30) clicksLast30Days += 1;

    clicksByProductId[row.affiliate_id] =
      (clicksByProductId[row.affiliate_id] ?? 0) + 1;

    const dk = dayKey(row.created_at);
    clicksByDayMap[dk] = (clicksByDayMap[dk] ?? 0) + 1;
  }

  const affiliateIds = Object.keys(clicksByProductId);
  const productMeta = new Map<
    string,
    { title: string; slug: string; category: string; platform: string }
  >();

  if (affiliateIds.length > 0) {
    const { data: products } = await supabase
      .from("affiliate_links")
      .select("id, title, slug, category, affiliate_platform")
      .in("id", affiliateIds);

    for (const product of products ?? []) {
      productMeta.set(product.id, {
        title: product.title,
        slug: product.slug,
        category: product.category,
        platform: product.affiliate_platform ?? "",
      });
      clicksByCategory[product.category] =
        (clicksByCategory[product.category] ?? 0) +
        (clicksByProductId[product.id] ?? 0);
    }
  }

  const topProducts = affiliateIds
    .map((id) => {
      const meta = productMeta.get(id);
      const clicks = clicksByProductId[id] ?? 0;
      const estimated = estimateConversions(clicks, meta?.platform);
      return {
        id,
        title: meta?.title ?? "Produto removido",
        slug: meta?.slug ?? id,
        category: meta?.category ?? "other",
        platform: meta?.platform ?? "",
        clicks,
        estimatedConversions: estimated,
        estimatedConversionRate: formatEstimatedConversionRate(clicks, estimated),
      };
    })
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  const topCategories = Object.entries(clicksByCategory)
    .map(([category, count]) => ({ category, clicks: count }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 8);

  const clicksByDay = Object.entries(clicksByDayMap)
    .map(([date, count]) => ({ date, clicks: count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  const { count: totalClicks } = await supabase
    .from("affiliate_clicks")
    .select("id", { count: "exact", head: true });

  const total = totalClicks ?? rows.length;
  const estimatedConversions = topProducts.reduce(
    (sum, product) => sum + product.estimatedConversions,
    0,
  );

  return {
    totalClicks: total,
    clicksLast7Days,
    clicksLast30Days,
    topProducts,
    clicksByDay,
    topCategories,
    clicksByProductId,
    estimatedConversions,
    estimatedConversionRate: formatEstimatedConversionRate(total, estimatedConversions),
  };
}
