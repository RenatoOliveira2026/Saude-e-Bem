import type { UserToolResultRecord } from "@/lib/health-profile/types";
import { calculateHealthScore, getUnmetCriteria } from "@/lib/recommendations/health-score";
import type { ScoreCriterionId } from "@/lib/recommendations/recommendation-types";
import { routes } from "@/lib/routes";
import type {
  MarketplaceItem,
  RecommendedMarketplaceProduct,
} from "./marketplace.types";

const MIN_MATCH_SCORE = 10;
const MAX_RECOMMENDATIONS = 3;

type MarketplaceMatchCandidate = {
  item: MarketplaceItem;
  reason: string;
  matchScore: number;
  href: string;
};

function resolveItemHref(item: MarketplaceItem): string {
  if (item.fulfillment === "affiliate" && item.affiliateSlug) {
    return routes.recomendado(item.affiliateSlug);
  }
  if (item.fulfillment === "digital" && item.librarySlug) {
    return routes.bibliotecaItem(item.librarySlug);
  }
  if (item.fulfillment === "subscription") {
    return routes.assinar;
  }
  if (item.fulfillment === "own") {
    return routes.marketplaceItem(item.slug);
  }
  return routes.marketplaceItem(item.slug);
}

function scoreItem(
  item: MarketplaceItem,
  unmetIds: Set<ScoreCriterionId>,
  scorePercentage: number,
): { score: number; reason: string } | null {
  let score = 0;
  const reasons: string[] = [];

  const tags = item.healthTags ?? [];
  for (const tag of tags) {
    if (unmetIds.has(tag)) {
      score += 22;
      reasons.push(`Relacionado ao critério ${criterionLabel(tag)}`);
    }
  }

  if (item.fulfillment === "digital" && !item.isPremium && unmetIds.size > 0) {
    score += 8;
    reasons.push("Conteúdo digital gratuito");
  }

  if (item.fulfillment === "affiliate" && (unmetIds.has("cardiometabolic") || unmetIds.has("bmi"))) {
    score += 12;
    reasons.push("Apoio à prevenção e composição corporal");
  }

  if (item.fulfillment === "subscription" && scorePercentage < 60) {
    score += 14;
    reasons.push("Score abaixo de 60 — evolução com Premium");
  }

  if (item.editorChoice) {
    score += 6;
    reasons.push("Escolha do editor");
  }

  if (score === 0) return null;
  return { score, reason: reasons.slice(0, 2).join(" · ") };
}

function criterionLabel(id: ScoreCriterionId): string {
  const labels: Record<ScoreCriterionId, string> = {
    bmi: "IMC",
    water: "hidratação",
    protein: "proteína",
    metabolism: "metabolismo",
    cardiometabolic: "risco cardiometabólico",
    habits: "hábitos",
  };
  return labels[id];
}

/**
 * Recomenda 1–3 produtos com base no Score Saúde & Bem e lacunas do perfil.
 */
export function recommendMarketplaceProducts(
  records: UserToolResultRecord[],
  catalog: MarketplaceItem[],
): RecommendedMarketplaceProduct[] {
  const score = calculateHealthScore(records);
  const unmetIds = new Set(getUnmetCriteria(score).map((c) => c.id));

  const matches = catalog
    .map((item) => {
      const match = scoreItem(item, unmetIds, score.percentage);
      if (!match) return null;
      return {
        item,
        reason: match.reason,
        matchScore: match.score,
        href: resolveItemHref(item),
      };
    })
    .filter((m): m is MarketplaceMatchCandidate => m !== null)
    .sort((a, b) => b.matchScore - a.matchScore);

  const qualified = matches.filter((m) => m.matchScore >= MIN_MATCH_SCORE);
  const selected =
    qualified.length > 0
      ? qualified.slice(0, MAX_RECOMMENDATIONS)
      : catalog
          .filter((item) => item.featured || item.editorChoice)
          .slice(0, 1)
          .map((item) => ({
            item,
            reason: "Destaque editorial do marketplace",
            matchScore: 8,
            href: resolveItemHref(item),
          }));

  return selected.map((match, index) => ({
    ...match,
    priority: index + 1,
  }));
}

export { resolveItemHref };
