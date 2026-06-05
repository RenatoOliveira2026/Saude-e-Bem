import { buildIntelligentRecommendations } from "@/lib/recommendations/recommendation-engine";
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
  const intelligent = await buildIntelligentRecommendations(records);

  return {
    displayName,
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
    priorities: intelligent.priorities,
  };
}
