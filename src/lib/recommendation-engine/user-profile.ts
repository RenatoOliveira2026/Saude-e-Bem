import {
  contentIntelligenceKey,
  getObjectiveLabel,
  type ContentObjective,
} from "@/lib/content/intelligence";
import type { ContentLevel } from "@/lib/data/types";
import { goalLabels, goalToTrailObjective } from "@/lib/journey/constants";
import type { UserActivitySnapshot } from "@/lib/premium/trail-progress";
import type { TrailProgress } from "@/lib/premium/trail-progress";
import type { CategoryScore, IntelligentUserProfile } from "./types";

const ALL_OBJECTIVES: ContentObjective[] = [
  "sono",
  "ansiedade",
  "alimentacao",
  "emagrecimento",
  "saude-feminina",
  "saude-masculina",
  "longevidade",
  "energia",
  "bem-estar",
];

function buildConsumedKeys(activity: UserActivitySnapshot): string[] {
  const keys: string[] = [];
  for (const [type, slugs] of Object.entries(activity.accessed)) {
    if (!slugs) continue;
    for (const slug of slugs) {
      keys.push(contentIntelligenceKey(type as "article", slug));
    }
  }
  return keys;
}

function scoreObjectives(input: {
  goalObjective: ContentObjective | null;
  activity: UserActivitySnapshot;
  trails: TrailProgress[];
}): CategoryScore[] {
  const scores = new Map<ContentObjective, number>();

  for (const obj of ALL_OBJECTIVES) {
    scores.set(obj, obj === input.goalObjective ? 40 : 5);
  }

  for (const trail of input.trails) {
    const boost = trail.percentComplete >= 100 ? 25 : trail.percentComplete > 0 ? 15 : 0;
    scores.set(trail.objective, (scores.get(trail.objective) ?? 0) + boost);
  }

  const articleCount = input.activity.accessed.article?.size ?? 0;
  const protocolCount =
    input.activity.protocolSlugsInProgress.size +
    input.activity.protocolSlugsCompleted.size;
  const libraryCount = input.activity.downloadedLibrarySlugs.size;

  if (articleCount > 2) {
    for (const obj of ALL_OBJECTIVES) {
      scores.set(obj, (scores.get(obj) ?? 0) + 2);
    }
  }
  if (protocolCount > 0) {
    scores.set(input.goalObjective ?? "bem-estar", (scores.get(input.goalObjective ?? "bem-estar") ?? 0) + 10);
  }
  if (libraryCount > 0) {
    scores.set("alimentacao", (scores.get("alimentacao") ?? 0) + 5);
  }

  return ALL_OBJECTIVES.map((objective) => ({
    objective,
    label: getObjectiveLabel(objective),
    score: Math.min(100, scores.get(objective) ?? 0),
  })).sort((a, b) => b.score - a.score);
}

function inferPreferredLevel(activity: UserActivitySnapshot): ContentLevel {
  const total =
    (activity.accessed.article?.size ?? 0) +
    activity.protocolSlugsCompleted.size +
    activity.downloadedLibrarySlugs.size;
  if (total >= 10) return "Avançado";
  if (total >= 4) return "Intermediário";
  return "Iniciante";
}

export function buildIntelligentUserProfile(input: {
  userId: string;
  goalKey: string | null;
  isPremium: boolean;
  activity: UserActivitySnapshot;
  trails: TrailProgress[];
}): IntelligentUserProfile {
  const goalObjective = input.goalKey
    ? (goalToTrailObjective[input.goalKey as keyof typeof goalToTrailObjective] ?? null)
    : null;

  const trailsCompleted = trailsCount(input.trails, 100);
  const trailsStarted = trailsCount(input.trails, 1);

  return {
    userId: input.userId,
    goalKey: input.goalKey,
    goalObjective,
    goalLabel: input.goalKey ? (goalLabels[input.goalKey] ?? null) : null,
    isPremium: input.isPremium,
    categoryScores: scoreObjectives({
      goalObjective,
      activity: input.activity,
      trails: input.trails,
    }),
    consumedKeys: buildConsumedKeys(input.activity),
    trailsCompleted,
    trailsStarted,
    protocolsInProgress: input.activity.protocolSlugsInProgress.size,
    articlesRead: input.activity.accessed.article?.size ?? 0,
    libraryDownloads: input.activity.downloadedLibrarySlugs.size,
    preferredLevel: inferPreferredLevel(input.activity),
    availableMinutes: trailsStarted > 0 ? 20 : 10,
  };
}

function trailsCount(trails: TrailProgress[], minPercent: number): number {
  return trails.filter((t) =>
    minPercent >= 100 ? t.percentComplete >= 100 : t.percentComplete > 0,
  ).length;
}
