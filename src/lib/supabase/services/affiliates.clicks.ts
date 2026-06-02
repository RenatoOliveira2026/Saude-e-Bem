import { createClient } from "@/lib/supabase/server";

export async function recordAffiliateClick(
  affiliateId: string,
  sourcePage: string,
  sourceType: string,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("affiliate_clicks").insert({
    affiliate_id: affiliateId,
    source_page: sourcePage.slice(0, 500),
    source_type: sourceType.slice(0, 64),
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
