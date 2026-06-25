import type { IntelligentContentType } from "@/lib/content/intelligence";
import { routes } from "@/lib/routes";
import type { PremiumTrail, PremiumTrailStep } from "./trails";

export interface UserActivitySnapshot {
  /** slug por tipo de conteúdo acessado */
  accessed: Partial<Record<IntelligentContentType, Set<string>>>;
  /** protocolos com status in_progress ou completed */
  protocolSlugsInProgress: Set<string>;
  protocolSlugsCompleted: Set<string>;
  /** slugs de biblioteca baixados */
  downloadedLibrarySlugs: Set<string>;
}

export interface TrailStepProgress extends PremiumTrailStep {
  href: string;
  completed: boolean;
}

export interface TrailProgress extends PremiumTrail {
  stepsProgress: TrailStepProgress[];
  completedCount: number;
  totalSteps: number;
  percentComplete: number;
}

export function resolveTrailStepHref(step: PremiumTrailStep): string {
  switch (step.type) {
    case "article":
      return routes.artigo(step.slug);
    case "protocol":
      return routes.protocolo(step.slug);
    case "library":
      return routes.bibliotecaItem(step.slug);
    case "tool":
      return routes.ferramenta(step.slug);
    case "checklist":
      if (step.slug === "checklist-habitos") return routes.checklistHabitos;
      if (step.slug === "guia-30-dias") return routes.guia30Dias;
      return routes.biblioteca;
    default:
      return routes.home;
  }
}

export function isTrailStepCompleted(
  step: PremiumTrailStep,
  activity: UserActivitySnapshot,
): boolean {
  const accessed = activity.accessed[step.type];
  if (accessed?.has(step.slug)) return true;

  if (step.type === "protocol") {
    if (activity.protocolSlugsCompleted.has(step.slug)) return true;
    if (activity.protocolSlugsInProgress.has(step.slug)) return true;
  }

  if (step.type === "library" && activity.downloadedLibrarySlugs.has(step.slug)) {
    return true;
  }

  if (step.type === "checklist") {
    const checklistPaths = new Set([routes.checklistHabitos, routes.guia30Dias]);
    const checklistAccessed = activity.accessed.checklist;
    if (checklistAccessed?.has(step.slug)) return true;
    // fallback: any checklist route visited
    if (step.slug === "checklist-habitos" && checklistAccessed?.size) return true;
    void checklistPaths;
  }

  return false;
}

export function buildTrailProgress(
  trail: PremiumTrail,
  activity: UserActivitySnapshot,
): TrailProgress {
  const stepsProgress: TrailStepProgress[] = trail.steps.map((step) => {
    const completed = isTrailStepCompleted(step, activity);
    return {
      ...step,
      href: resolveTrailStepHref(step),
      completed,
    };
  });

  const completedCount = stepsProgress.filter((s) => s.completed).length;
  const totalSteps = stepsProgress.length;
  const percentComplete =
    totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return {
    ...trail,
    stepsProgress,
    completedCount,
    totalSteps,
    percentComplete,
  };
}

export function buildAllTrailsProgress(
  trails: PremiumTrail[],
  activity: UserActivitySnapshot,
): TrailProgress[] {
  return trails.map((trail) => buildTrailProgress(trail, activity));
}

export function pickRecommendedTrail(
  trailsProgress: TrailProgress[],
  goalObjective?: string | null,
): TrailProgress | null {
  if (trailsProgress.length === 0) return null;

  const inProgress = trailsProgress.filter(
    (t) => t.percentComplete > 0 && t.percentComplete < 100,
  );
  if (inProgress.length > 0) {
    return inProgress.sort((a, b) => b.percentComplete - a.percentComplete)[0];
  }

  if (goalObjective) {
    const byGoal = trailsProgress.find(
      (t) => t.objective === goalObjective && t.percentComplete < 100,
    );
    if (byGoal) return byGoal;
  }

  return trailsProgress.find((t) => t.percentComplete < 100) ?? trailsProgress[0];
}
