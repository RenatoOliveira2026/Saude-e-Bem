import { getClubMembership } from "@/lib/club/access";
import { getSessionProfile } from "@/lib/auth/session";
import {
  PREMIUM_TRAILS,
  buildAllTrailsProgress,
  fetchUserActivitySnapshot,
  pickRecommendedTrail,
} from "@/lib/premium";
import type { TrailProgress, UserActivitySnapshot } from "@/lib/premium/trail-progress";
import { goalToTrailObjective } from "@/lib/journey/constants";
import { loadRecommendationCatalog } from "./catalog";
import { buildIntelligentUserProfile } from "./user-profile";
import {
  generateRecommendations,
  pickByType,
  pickNextStep,
  pickRecommendationOfTheDay,
} from "./engine";
import { getAlsoBenefitFromLastConsumed } from "./relationships";
import type { CatalogItem, IntelligentJourneyPanel } from "./types";

export async function buildIntelligentJourneyPanel(input: {
  userId: string;
  goalKey: string | null;
  isPremium: boolean;
  activity: UserActivitySnapshot;
  trails: TrailProgress[];
  activeTrail: TrailProgress | null;
  catalog?: CatalogItem[];
}): Promise<IntelligentJourneyPanel> {
  const catalog = input.catalog ?? (await loadRecommendationCatalog());

  const profile = buildIntelligentUserProfile({
    userId: input.userId,
    goalKey: input.goalKey,
    isPremium: input.isPremium,
    activity: input.activity,
    trails: input.trails,
  });

  const recommendations = generateRecommendations({
    catalog,
    profile,
    activeTrail: input.activeTrail,
    limit: 15,
  });

  const recommendationOfTheDay = pickRecommendationOfTheDay(recommendations);
  const nextStep = pickNextStep({ recommendations, activeTrail: input.activeTrail });

  return {
    recommendationOfTheDay: recommendationOfTheDay
      ? { ...recommendationOfTheDay, kind: "daily" }
      : null,
    nextStep,
    recommendedArticle: pickByType(recommendations, "article"),
    recommendedProtocol: pickByType(recommendations, "protocol"),
    recommendedLibrary: pickByType(recommendations, "library"),
    alsoBenefitFrom: getAlsoBenefitFromLastConsumed({
      consumedKeys: profile.consumedKeys,
      catalog,
      limit: 3,
    }),
    topRecommendations: recommendations.slice(0, 6),
  };
}

export async function getIntelligentJourneyPanel(): Promise<IntelligentJourneyPanel> {
  const { user, profile: profileData } = await getSessionProfile();
  const { preferences } = profileData;
  const goalKey = preferences?.goal ?? null;

  const [membership, activity, catalog] = await Promise.all([
    getClubMembership(user.id),
    fetchUserActivitySnapshot(user.id),
    loadRecommendationCatalog(),
  ]);

  const trails = buildAllTrailsProgress(PREMIUM_TRAILS, activity);
  const trailObjective = goalKey
    ? goalToTrailObjective[goalKey as keyof typeof goalToTrailObjective]
    : null;
  const activeTrail = pickRecommendedTrail(trails, trailObjective ?? null);

  return buildIntelligentJourneyPanel({
    userId: user.id,
    goalKey,
    isPremium: membership.isPremium,
    activity,
    trails,
    activeTrail,
    catalog,
  });
}
