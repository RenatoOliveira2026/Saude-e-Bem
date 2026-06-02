import { getAffiliateAdminCounts } from "@/lib/admin/services/affiliates.service";
import { getNewsletterLeadStats } from "@/lib/admin/services/newsletter.service";
import { createClient } from "@/lib/supabase/server";
import { getAffiliateClickStats } from "@/lib/supabase/services/affiliates.clicks";
import type { ContentPublishStatus } from "@/lib/admin/cms/form-utils";
import type { DashboardStats } from "../types";

async function countByStatus(
  table: "articles" | "protocols" | "ebooks",
  status: ContentPublishStatus,
): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("status", status);
  if (error) throw error;
  return count ?? 0;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [users, articles, protocols, ebooks, favorites] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("protocols").select("id", { count: "exact", head: true }),
    supabase.from("ebooks").select("id", { count: "exact", head: true }),
    supabase.from("favorites").select("id", { count: "exact", head: true }),
  ]);

  const [publishedArticles, publishedProtocols, publishedEbooks] = await Promise.all([
    countByStatus("articles", "published"),
    countByStatus("protocols", "published"),
    countByStatus("ebooks", "published"),
  ]);

  const [draftArticles, draftProtocols, draftEbooks] = await Promise.all([
    countByStatus("articles", "draft"),
    countByStatus("protocols", "draft"),
    countByStatus("ebooks", "draft"),
  ]);

  const [archivedArticles, archivedProtocols, archivedEbooks] = await Promise.all([
    countByStatus("articles", "archived"),
    countByStatus("protocols", "archived"),
    countByStatus("ebooks", "archived"),
  ]);

  const [affiliateCounts, clickStats, newsletterStats] = await Promise.all([
    getAffiliateAdminCounts(),
    getAffiliateClickStats(),
    getNewsletterLeadStats().catch(() => ({
      total: 0,
      active: 0,
      last7Days: 0,
      last30Days: 0,
      bySource: { home: 0, blog: 0, biblioteca: 0, clube: 0, other: 0 },
      pendingSync: 0,
    })),
  ]);

  return {
    users: users.count ?? 0,
    articles: articles.count ?? 0,
    protocols: protocols.count ?? 0,
    ebooks: ebooks.count ?? 0,
    favorites: favorites.count ?? 0,
    publishedTotal: publishedArticles + publishedProtocols + publishedEbooks,
    draftsTotal: draftArticles + draftProtocols + draftEbooks,
    archivedTotal: archivedArticles + archivedProtocols + archivedEbooks,
    affiliatesTotal: affiliateCounts.total,
    affiliatesActive: affiliateCounts.active,
    affiliatesFeatured: affiliateCounts.featured,
    affiliateClicksTotal: clickStats.total,
    affiliateClicksLast30Days: clickStats.last30Days,
    newsletterSubscribersTotal: newsletterStats.total,
    newsletterSubscribersLast30Days: newsletterStats.last30Days,
  };
}
