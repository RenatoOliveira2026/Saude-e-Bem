import type { BlogArticle, Protocol } from "@/lib/data/types";
import {
  goalLabels,
  goalToProtocolCategory,
  goalToTrailObjective,
} from "@/lib/journey/constants";
import {
  buildAllTrailsProgress,
  fetchUserActivitySnapshot,
  pickRecommendedTrail,
  PREMIUM_TRAILS,
  type TrailProgress,
} from "@/lib/premium";
import { routes } from "@/lib/routes";
import type { OnboardingPlan, OnboardingRecommendation } from "./types";

function mapTrail(trail: TrailProgress): OnboardingRecommendation {
  const next = trail.stepsProgress.find((s) => !s.completed) ?? trail.stepsProgress[0];
  return {
    id: `trail-${trail.slug}`,
    type: "trail",
    title: trail.title,
    description: next
      ? `Comece por: ${next.label}`
      : trail.subtitle,
    href: `${routes.clubeTrilhas}#${trail.slug}`,
    icon: trail.icon,
    badge: trail.durationLabel,
  };
}

function mapProtocol(protocol: Protocol): OnboardingRecommendation {
  return {
    id: `protocol-${protocol.slug}`,
    type: "protocol",
    title: protocol.title,
    description: protocol.description,
    href: routes.protocolo(protocol.slug),
    icon: "sparkle",
    badge: protocol.duration,
  };
}

function mapArticle(article: BlogArticle): OnboardingRecommendation {
  return {
    id: `article-${article.slug}`,
    type: "article",
    title: article.title,
    description: article.excerpt,
    href: routes.artigo(article.slug),
    icon: "book",
    badge: article.readTime ?? undefined,
  };
}

export function buildOnboardingPlan(
  goalKey: string | null,
  protocols: Protocol[],
  articles: BlogArticle[],
  trailProgress: TrailProgress[],
): OnboardingPlan {
  const goalLabel = goalKey ? (goalLabels[goalKey] ?? null) : null;
  const trailObjective = goalKey
    ? goalToTrailObjective[goalKey as keyof typeof goalToTrailObjective]
    : null;

  const trail = pickRecommendedTrail(trailProgress, trailObjective ?? null);
  const protocolCategory = goalKey ? goalToProtocolCategory[goalKey] : null;
  const protocol =
    (protocolCategory
      ? protocols.find((p) => p.category === protocolCategory && !p.isPremium)
      : null) ??
    protocols.find((p) => !p.isPremium) ??
    protocols[0] ??
    null;

  const article =
    (goalKey
      ? articles.find((a) => a.category === goalKey)
      : null) ??
    articles[0] ??
    null;

  return {
    goalKey,
    goalLabel,
    trail: trail ? mapTrail(trail) : null,
    protocol: protocol ? mapProtocol(protocol) : null,
    article: article ? mapArticle(article) : null,
  };
}

export async function buildOnboardingPlanForUser(
  userId: string,
  goalKey: string | null,
  protocols: Protocol[],
  articles: BlogArticle[],
): Promise<OnboardingPlan> {
  const activity = await fetchUserActivitySnapshot(userId);
  const trailProgress = buildAllTrailsProgress(PREMIUM_TRAILS, activity);
  return buildOnboardingPlan(goalKey, protocols, articles, trailProgress);
}
