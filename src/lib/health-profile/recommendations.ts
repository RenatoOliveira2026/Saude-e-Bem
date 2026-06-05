import { buildIntelligentRecommendations } from "@/lib/recommendations/recommendation-engine";
import type { HealthRecommendation, UserToolResultRecord } from "./types";

/** @deprecated Use buildIntelligentRecommendations — mantido para compatibilidade */
export async function buildHealthRecommendations(
  records: UserToolResultRecord[],
): Promise<HealthRecommendation[]> {
  const { protocols } = await buildIntelligentRecommendations(records);
  return protocols.map((p) => ({
    protocolSlug: p.protocolSlug,
    protocolTitle: p.protocolTitle,
    categoryLabel: p.categoryLabel,
    reason: p.reason,
    href: p.href,
    isPremium: p.isPremium,
  }));
}
