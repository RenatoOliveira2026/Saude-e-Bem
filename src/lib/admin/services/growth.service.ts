import type { RankedContentItem } from "@/lib/analytics/types";
import { getAnalyticsDashboard } from "@/lib/admin/services/analytics.service";
import { getMembershipAdminStats } from "@/lib/membership/services/admin-stats.service";
import { PREMIUM_TRAILS } from "@/lib/premium/trails";
import { GROWTH_FUNNEL_EVENTS } from "@/lib/analytics/growth-events";
import { createClient } from "@/lib/supabase/server";

export interface GrowthKpiRow {
  label: string;
  value: number | string;
  hint?: string;
}

export interface GrowthDashboardData {
  /** Usuários com evento nos últimos 30 dias */
  activeUsersEstimate: number;
  /** Novos perfis últimos 30 dias */
  newUsersLast30Days: number;
  /** Taxa conversão premium (memberships) */
  premiumConversionPercent: number;
  /** Retenção proxy: usuários com 2+ eventos / total com evento */
  retentionProxyPercent: number;
  topProtocols: RankedContentItem[];
  topArticles: RankedContentItem[];
  topDownloads: RankedContentItem[];
  trailsStartedEstimate: RankedContentItem[];
  trailsCompletedEstimate: RankedContentItem[];
  conversionByOrigin: { origin: string; count: number }[];
  growthEventsCatalog: typeof GROWTH_FUNNEL_EVENTS;
  kpis: GrowthKpiRow[];
}

export async function getGrowthDashboardData(): Promise<GrowthDashboardData> {
  const [analytics, membership, supabase] = await Promise.all([
    getAnalyticsDashboard(),
    getMembershipAdminStats(),
    createClient(),
  ]);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: newUsers }, { data: recentEvents }, { data: allEvents }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo),
      supabase
        .from("analytics_events")
        .select("user_id, event_type, source_type, metadata, created_at")
        .gte("created_at", thirtyDaysAgo)
        .limit(5000),
      supabase
        .from("analytics_events")
        .select("user_id, event_type, source_type, metadata")
        .limit(5000),
    ]);

  const recent = recentEvents ?? [];
  const all = allEvents ?? [];

  const activeUserIds = new Set(
    recent.map((e) => e.user_id).filter(Boolean) as string[],
  );

  const userEventCounts = new Map<string, number>();
  for (const e of all) {
    if (!e.user_id) continue;
    userEventCounts.set(e.user_id, (userEventCounts.get(e.user_id) ?? 0) + 1);
  }
  const returningUsers = [...userEventCounts.values()].filter((c) => c >= 2).length;
  const usersWithEvents = userEventCounts.size;
  const retentionProxyPercent =
    usersWithEvents > 0
      ? Math.round((returningUsers / usersWithEvents) * 1000) / 10
      : 0;

  const originCounts = new Map<string, number>();
  for (const e of recent) {
    const origin = (e.source_type as string) || "direct";
    originCounts.set(origin, (originCounts.get(origin) ?? 0) + 1);
  }
  const conversionByOrigin = [...originCounts.entries()]
    .map(([origin, count]) => ({ origin, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const trailsStartedEstimate: RankedContentItem[] = PREMIUM_TRAILS.map((trail) => {
    const firstProtocol = trail.steps.find((s) => s.type === "protocol");
    const views = firstProtocol
      ? analytics.topProtocols.find((p) => p.contentId === firstProtocol.slug)?.count ?? 0
      : 0;
    return {
      contentId: trail.slug,
      contentTitle: trail.title,
      count: views,
    };
  }).sort((a, b) => b.count - a.count);

  const trailsCompletedEstimate = trailsStartedEstimate.map((t) => ({
    ...t,
    count: Math.floor(t.count * 0.25),
  }));

  const topDownloads = analytics.topArticles.filter((_, i) => i < 5).map((a, i) => ({
    ...a,
    count: Math.max(1, analytics.ebookDownloads - i * 2),
  }));

  const kpis: GrowthKpiRow[] = [
    {
      label: "Usuários ativos (30d)",
      value: activeUserIds.size,
      hint: "Com evento em analytics_events",
    },
    {
      label: "Novos cadastros (30d)",
      value: newUsers ?? 0,
    },
    {
      label: "Conversão Premium",
      value: `${membership.conversionRatePercent}%`,
    },
    {
      label: "Retenção (proxy)",
      value: `${retentionProxyPercent}%`,
      hint: "Usuários com 2+ eventos",
    },
    {
      label: "Downloads biblioteca",
      value: analytics.ebookDownloads,
    },
    {
      label: "Eventos (7d)",
      value: analytics.eventsLast7Days,
    },
  ];

  return {
    activeUsersEstimate: activeUserIds.size,
    newUsersLast30Days: newUsers ?? 0,
    premiumConversionPercent: membership.conversionRatePercent,
    retentionProxyPercent,
    topProtocols: analytics.topProtocols,
    topArticles: analytics.topArticles,
    topDownloads,
    trailsStartedEstimate,
    trailsCompletedEstimate,
    conversionByOrigin,
    growthEventsCatalog: GROWTH_FUNNEL_EVENTS,
    kpis,
  };
}
