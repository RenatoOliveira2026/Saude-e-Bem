import type { RankedContentItem } from "@/lib/analytics/types";
import { getRecommendationAdminStats } from "@/lib/recommendation-engine/admin-stats";
import { GROWTH_FUNNEL_EVENTS } from "@/lib/analytics/growth-events";

export interface RecommendationsAdminDashboard {
  stats: Awaited<ReturnType<typeof getRecommendationAdminStats>>;
  topRecommendedRanked: RankedContentItem[];
  topAcceptedRanked: RankedContentItem[];
  categoryInterestRanked: RankedContentItem[];
  kpis: { label: string; value: number | string; hint?: string }[];
  eventsCatalog: typeof GROWTH_FUNNEL_EVENTS;
}

export async function getRecommendationsAdminDashboard(): Promise<RecommendationsAdminDashboard> {
  const stats = await getRecommendationAdminStats();

  const topRecommendedRanked: RankedContentItem[] = stats.topRecommended.map((item) => ({
    contentId: `${item.type}-${item.slug}`,
    contentTitle: item.title,
    count: item.score,
  }));

  const topAcceptedRanked: RankedContentItem[] = stats.topAccepted.map((item) => ({
    contentId: `${item.type}-${item.slug}`,
    contentTitle: item.title,
    count: item.views,
  }));

  const categoryInterestRanked: RankedContentItem[] = stats.categoryInterest.map(
    (item) => ({
      contentId: item.objective,
      contentTitle: item.label,
      count: item.score,
    }),
  );

  const kpis = [
    {
      label: "Itens no catálogo",
      value: stats.totalCatalogItems,
      hint: "Artigos, protocolos, biblioteca e ferramentas",
    },
    {
      label: "Cobertura do registry",
      value: `${stats.registryCoveragePercent}%`,
      hint: "Metadados CONTENT_INTELLIGENCE_REGISTRY",
    },
    {
      label: "CTR proxy (30d)",
      value: `${stats.clickThroughProxyPercent}%`,
      hint: "Engajamento / impressões estimadas",
    },
    {
      label: "Top recomendados",
      value: stats.topRecommended.length,
      hint: "Score composto do motor",
    },
    {
      label: "Top aceitos",
      value: stats.topAccepted.length,
      hint: "content_rankings · 30 dias",
    },
    {
      label: "Categorias ativas",
      value: stats.categoryInterest.length,
      hint: "Interesse por objetivo",
    },
  ];

  return {
    stats,
    topRecommendedRanked,
    topAcceptedRanked,
    categoryInterestRanked,
    kpis,
    eventsCatalog: GROWTH_FUNNEL_EVENTS,
  };
}
