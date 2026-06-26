import { getContentIntelligence } from "@/lib/content/intelligence";
import type { TrailProgress } from "@/lib/premium/trail-progress";
import type {
  CatalogItem,
  IntelligentRecommendation,
  IntelligentUserProfile,
} from "./types";

const LEVEL_ORDER = { Iniciante: 0, Intermediário: 1, Avançado: 2 } as const;

function levelFit(userLevel: keyof typeof LEVEL_ORDER, itemLevel: keyof typeof LEVEL_ORDER): number {
  const diff = Math.abs(LEVEL_ORDER[userLevel] - LEVEL_ORDER[itemLevel]);
  if (diff === 0) return 15;
  if (diff === 1) return 8;
  return 0;
}

function timeFit(available: number, estimated: number): number {
  if (estimated <= available) return 12;
  if (estimated <= available + 10) return 6;
  return 0;
}

function objectiveFit(
  profile: IntelligentUserProfile,
  objective: CatalogItem["objective"],
): number {
  const top = profile.categoryScores[0];
  if (top?.objective === objective) return 30;
  const match = profile.categoryScores.find((c) => c.objective === objective);
  return match ? Math.round(match.score * 0.2) : 0;
}

function isConsumed(profile: IntelligentUserProfile, item: CatalogItem): boolean {
  return profile.consumedKeys.includes(item.key);
}

export function scoreCatalogItem(
  item: CatalogItem,
  profile: IntelligentUserProfile,
): number {
  if (!profile.isPremium && item.isPremium) return 0;

  let score = 0;
  if (!isConsumed(profile, item)) score += 35;
  else score -= 20;

  score += objectiveFit(profile, item.objective);
  score += levelFit(profile.preferredLevel, item.level);
  score += timeFit(profile.availableMinutes, item.estimatedMinutes);
  if (item.isNew) score += 8;

  const intel = getContentIntelligence(item.type, item.slug);
  if (intel?.related.some((r) => profile.consumedKeys.includes(`${r.type}:${r.slug}`))) {
    score += 12;
  }

  return Math.max(0, Math.round(score));
}

function toRecommendation(
  item: CatalogItem,
  score: number,
  reason: string,
  kind: IntelligentRecommendation["kind"],
): IntelligentRecommendation {
  return {
    id: item.key,
    type: item.type,
    slug: item.slug,
    title: item.title,
    description: item.description,
    href: item.href,
    reason,
    score,
    isPremium: item.isPremium,
    objective: item.objective,
    level: item.level,
    estimatedMinutes: item.estimatedMinutes,
    kind,
  };
}

export function generateRecommendations(input: {
  catalog: CatalogItem[];
  profile: IntelligentUserProfile;
  activeTrail: TrailProgress | null;
  limit?: number;
}): IntelligentRecommendation[] {
  const scored = input.catalog
    .map((item) => {
      const score = scoreCatalogItem(item, input.profile);
      const reason = buildReason(item, input.profile, score);
      return { item, score, reason };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  const unconsumed = scored.filter((r) => !isConsumed(input.profile, r.item));
  const pool = unconsumed.length > 0 ? unconsumed : scored;

  return pool
    .slice(0, input.limit ?? 12)
    .map((row) =>
      toRecommendation(row.item, row.score, row.reason, inferKind(row.item.type)),
    );
}

function inferKind(type: CatalogItem["type"]): IntelligentRecommendation["kind"] {
  if (type === "article") return "article";
  if (type === "protocol") return "protocol";
  if (type === "library") return "library";
  if (type === "tool") return "tool";
  return "daily";
}

function buildReason(
  item: CatalogItem,
  profile: IntelligentUserProfile,
  score: number,
): string {
  if (isConsumed(profile, item)) {
    return "Revisite para reforçar seu progresso.";
  }
  if (item.isNew) {
    return `Novidade alinhada ao seu objetivo de ${profile.goalLabel ?? "bem-estar"}.`;
  }
  if (profile.goalObjective === item.objective) {
    return `Recomendado para ${profile.goalLabel ?? "seu objetivo"}.`;
  }
  if (score >= 40) {
    return `Combina com seu perfil (${item.level}, ~${item.estimatedMinutes} min).`;
  }
  return "Conteúdo sugerido com base no seu histórico.";
}

export function pickNextStep(input: {
  recommendations: IntelligentRecommendation[];
  activeTrail: TrailProgress | null;
}): IntelligentRecommendation | null {
  if (input.activeTrail) {
    const next = input.activeTrail.stepsProgress.find((s) => !s.completed);
    if (next) {
      return {
        id: `trail-step-${next.id}`,
        type: next.type,
        slug: next.slug,
        title: next.label,
        description: `Trilha ${input.activeTrail.title} — próximo passo`,
        href: next.href,
        reason: "Continue sua trilha ativa.",
        score: 100,
        isPremium: next.isPremium ?? false,
        objective: input.activeTrail.objective,
        level: "Iniciante",
        estimatedMinutes: 10,
        kind: "next_step",
      };
    }
  }
  return input.recommendations[0] ?? null;
}

export function pickRecommendationOfTheDay(
  recommendations: IntelligentRecommendation[],
): IntelligentRecommendation | null {
  const daily = recommendations.find((r) => !r.kind || r.kind === "daily");
  return daily ?? recommendations[0] ?? null;
}

export function pickByType(
  recommendations: IntelligentRecommendation[],
  type: IntelligentRecommendation["type"] | "article" | "protocol" | "library",
): IntelligentRecommendation | null {
  const mapType = type === "library" ? "library" : type;
  return recommendations.find((r) => r.type === mapType) ?? null;
}
