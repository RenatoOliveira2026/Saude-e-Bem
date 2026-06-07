import { buildIntelligentRecommendations } from "@/lib/recommendations/recommendation-engine";
import {
  fetchMarketplaceItems,
  recommendMarketplaceProducts,
} from "@/lib/marketplace";
import { getClubMembership } from "@/lib/club/access";
import type { ClubMembership } from "@/lib/club/types";
import { getSessionProfile } from "@/lib/auth/session";
import {
  buildLatestSummaries,
  fetchUserToolResults,
} from "./services/tool-results.service";
import type { HealthProfileData } from "./types";

export async function getHealthProfileData(): Promise<HealthProfileData> {
  const { user, profile } = await getSessionProfile();
  const displayName =
    profile.profile?.name?.trim() ||
    user.email?.split("@")[0] ||
    "Membro";

  const records = await fetchUserToolResults(user.id);
  const latestByTool = buildLatestSummaries(records);
  const [intelligent, marketplaceCatalog, membership] = await Promise.all([
    buildIntelligentRecommendations(records),
    fetchMarketplaceItems(),
    getClubMembership(user.id),
  ]);
  const recommendedProducts = recommendMarketplaceProducts(
    records,
    marketplaceCatalog,
  );

  return {
    displayName,
    membership,
    latestByTool,
    history: records,
    recommendations: intelligent.protocols.map((p) => ({
      protocolSlug: p.protocolSlug,
      protocolTitle: p.protocolTitle,
      categoryLabel: p.categoryLabel,
      description: p.description,
      reason: p.reason,
      href: p.href,
      isPremium: p.isPremium,
      priority: p.priority,
    })),
    healthScore: intelligent.healthScore,
    recommendedTools: intelligent.tools,
    recommendedProducts,
    priorities: intelligent.priorities,
  };
}
