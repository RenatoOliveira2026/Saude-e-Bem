import type { ContinueReadingItem } from "@/lib/club/types";
import type { LibraryResource, Protocol } from "@/lib/data/types";
import { routes } from "@/lib/routes";
import type { TrailProgress } from "@/lib/premium/trail-progress";
import type { JourneyProgressStats } from "@/lib/journey/types";
import type { EngagementReminder, EngagementSnapshot, WeeklyProgressSummary } from "./types";

function buildInterruptedTrail(trails: TrailProgress[]): TrailProgress | null {
  const inProgress = trails.filter(
    (t) => t.percentComplete > 0 && t.percentComplete < 100,
  );
  if (inProgress.length === 0) return null;
  return inProgress.sort((a, b) => b.percentComplete - a.percentComplete)[0];
}

function buildWeeklyProgress(progress: JourneyProgressStats): WeeklyProgressSummary[] {
  return [
    {
      label: "Evolução geral",
      value: progress.overallPercent,
      unit: "%",
    },
    {
      label: "Materiais concluídos",
      value: progress.materialsCompleted,
      unit: "itens",
    },
    {
      label: "Protocolos em andamento",
      value: progress.protocolsStarted,
      unit: "protocolos",
    },
    {
      label: "Trilhas iniciadas",
      value: progress.trailsStarted,
      unit: "trilhas",
    },
  ];
}

function buildReminders(input: {
  continueItems: ContinueReadingItem[];
  interruptedTrail: TrailProgress | null;
  newContentCount: number;
  progress: JourneyProgressStats;
}): EngagementReminder[] {
  const reminders: EngagementReminder[] = [];

  if (input.continueItems[0]) {
    const item = input.continueItems[0];
    reminders.push({
      id: "continue-reading",
      title: "Continue sua jornada",
      description: item.title,
      href: item.href,
      kind: "continue",
      priority: 100,
    });
  }

  if (input.interruptedTrail) {
    const trail = input.interruptedTrail;
    const next = trail.stepsProgress.find((s) => !s.completed);
    reminders.push({
      id: `trail-${trail.slug}`,
      title: "Trilha interrompida",
      description: next
        ? `${trail.title} — próximo: ${next.label}`
        : trail.title,
      href: next?.href ?? `${routes.clubeTrilhas}#${trail.slug}`,
      kind: "trail",
      priority: 90,
    });
  }

  if (input.newContentCount > 0) {
    reminders.push({
      id: "new-content",
      title: "Novidades na biblioteca",
      description: `${input.newContentCount} materiais novos para explorar`,
      href: routes.biblioteca,
      kind: "new",
      priority: 70,
    });
  }

  if (input.progress.overallPercent > 0 && input.progress.overallPercent < 100) {
    reminders.push({
      id: "weekly-progress",
      title: "Seu progresso semanal",
      description: `Você está em ${input.progress.overallPercent}% da sua jornada`,
      href: routes.minhaJornada,
      kind: "weekly",
      priority: 60,
    });
  }

  return reminders.sort((a, b) => b.priority - a.priority);
}

export function buildEngagementSnapshot(input: {
  continueItems: ContinueReadingItem[];
  trails: TrailProgress[];
  recommendedProtocols: Protocol[];
  librarySuggestions: LibraryResource[];
  newContentCount: number;
  progress: JourneyProgressStats;
}): EngagementSnapshot {
  const interruptedTrail = buildInterruptedTrail(input.trails);

  return {
    continueItems: input.continueItems,
    interruptedTrail,
    recommendedProtocols: input.recommendedProtocols.slice(0, 3),
    recommendedLibrary: input.librarySuggestions.slice(0, 3),
    newContentCount: input.newContentCount,
    weeklyProgress: buildWeeklyProgress(input.progress),
    reminders: buildReminders({
      continueItems: input.continueItems,
      interruptedTrail,
      newContentCount: input.newContentCount,
      progress: input.progress,
    }),
  };
}
