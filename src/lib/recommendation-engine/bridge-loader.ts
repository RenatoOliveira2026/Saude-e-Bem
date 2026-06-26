import { getClubMembership } from "@/lib/club/access";
import { getSessionProfile } from "@/lib/auth/session";
import {
  PREMIUM_TRAILS,
  buildAllTrailsProgress,
  fetchUserActivitySnapshot,
  pickRecommendedTrail,
} from "@/lib/premium";
import { goalToTrailObjective } from "@/lib/journey/constants";
import { loadRecommendationCatalog } from "./catalog";
import { buildIntelligentUserProfile } from "./user-profile";
import { generateRecommendations } from "./engine";
import { getAlsoBenefitFromLastConsumed } from "./relationships";
import { buildIntelligentJourneyPanel } from "./journey-panel";
import {
  createRecommendationEngineBridge,
  type RecommendationEngineContext,
  type RecommendationEngineQuery,
} from "./ai-bridge";

export async function loadRecommendationEngineContext(
  query: RecommendationEngineQuery,
): Promise<RecommendationEngineContext> {
  const goalKey = query.goalKey ?? null;
  const isPremium = query.isPremium ?? false;

  const [activity, catalog] = await Promise.all([
    fetchUserActivitySnapshot(query.userId),
    loadRecommendationCatalog(),
  ]);

  const trails = buildAllTrailsProgress(PREMIUM_TRAILS, activity);
  const trailObjective = goalKey
    ? goalToTrailObjective[goalKey as keyof typeof goalToTrailObjective]
    : null;
  const activeTrail = pickRecommendedTrail(trails, trailObjective ?? null);

  const profile = buildIntelligentUserProfile({
    userId: query.userId,
    goalKey,
    isPremium,
    activity,
    trails,
  });

  const recommendations = generateRecommendations({
    catalog,
    profile,
    activeTrail,
    limit: query.limit ?? 12,
  });

  const journeyPanel = await buildIntelligentJourneyPanel({
    userId: query.userId,
    goalKey,
    isPremium,
    activity,
    trails,
    activeTrail,
    catalog,
  });

  const alsoBenefit = getAlsoBenefitFromLastConsumed({
    consumedKeys: profile.consumedKeys,
    catalog,
    limit: 5,
  });

  return {
    profile,
    recommendations,
    journeyPanel,
    alsoBenefit,
  };
}

/** Bridge pronto para injeção em futura camada conversacional. */
export const recommendationEngineBridge = createRecommendationEngineBridge({
  loadContext: loadRecommendationEngineContext,
});

export async function loadRecommendationEngineContextForSession(): Promise<RecommendationEngineContext> {
  const { user, profile: profileData } = await getSessionProfile();
  const membership = await getClubMembership(user.id);
  return loadRecommendationEngineContext({
    userId: user.id,
    goalKey: profileData.preferences?.goal ?? null,
    isPremium: membership.isPremium,
  });
}
