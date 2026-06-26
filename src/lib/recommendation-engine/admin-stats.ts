import {
  CONTENT_INTELLIGENCE_REGISTRY,
  getObjectiveLabel,
  type ContentObjective,
} from "@/lib/content/intelligence";
import { fetchContentRankings } from "@/lib/club/services/intelligent-recommendations.service";
import { loadRecommendationCatalog } from "./catalog";
import type { RecommendationAdminStats } from "./types";

function mapRankingTypeToCatalog(
  rankingType: string,
): "article" | "protocol" | "library" | "tool" | null {
  if (rankingType === "article") return "article";
  if (rankingType === "protocol") return "protocol";
  if (rankingType === "ebook") return "library";
  return null;
}

export async function getRecommendationAdminStats(): Promise<RecommendationAdminStats> {
  const [catalog, rankings] = await Promise.all([
    loadRecommendationCatalog(),
    fetchContentRankings("30d", 25),
  ]);

  const registryKeys = Object.keys(CONTENT_INTELLIGENCE_REGISTRY);
  const catalogKeys = new Set(catalog.map((c) => c.key));
  const covered = registryKeys.filter((k) => catalogKeys.has(k)).length;
  const registryCoveragePercent =
    registryKeys.length > 0 ? Math.round((covered / registryKeys.length) * 100) : 100;

  const rankingBySlug = new Map(
    rankings
      .filter((r) => r.slug)
      .map((r) => [`${mapRankingTypeToCatalog(r.contentType) ?? r.contentType}:${r.slug}`, r]),
  );

  const topRecommended = catalog
    .map((item) => {
      const ranking = rankingBySlug.get(`${item.type}:${item.slug}`);
      const engagement = ranking ? ranking.viewCount + ranking.downloadCount : 0;
      const score = item.isNew ? 30 + engagement : 10 + engagement;
      return {
        title: item.title,
        slug: item.slug,
        type: item.type,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const topAccepted = rankings
    .map((r) => ({
      title: r.title,
      slug: r.slug ?? "",
      type: r.contentType,
      views: r.viewCount + r.downloadCount,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const objectiveScores = new Map<ContentObjective, number>();
  for (const item of catalog) {
    const ranking = rankingBySlug.get(`${item.type}:${item.slug}`);
    const boost = ranking ? ranking.viewCount + ranking.downloadCount * 2 : 1;
    objectiveScores.set(item.objective, (objectiveScores.get(item.objective) ?? 0) + boost);
  }

  const categoryInterest = [...objectiveScores.entries()]
    .map(([objective, score]) => ({
      objective,
      label: getObjectiveLabel(objective),
      score,
    }))
    .sort((a, b) => b.score - a.score);

  const totalEngagement = rankings.reduce(
    (sum, r) => sum + r.viewCount + r.downloadCount,
    0,
  );
  const impressionEstimate = Math.max(catalog.length * 8, 1);
  const clickThroughProxyPercent = Math.min(
    100,
    Math.round((totalEngagement / impressionEstimate) * 100),
  );

  return {
    topRecommended,
    topAccepted,
    categoryInterest,
    clickThroughProxyPercent,
    totalCatalogItems: catalog.length,
    registryCoveragePercent,
  };
}
