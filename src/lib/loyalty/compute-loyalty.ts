import type { UserActivitySnapshot } from "@/lib/premium/trail-progress";
import type { TrailProgress } from "@/lib/premium/trail-progress";
import type { JourneyProgressStats } from "@/lib/journey/types";
import { ACHIEVEMENTS } from "./achievements";
import type { AchievementId, LoyaltySnapshot, PersonalGoal } from "./types";

function estimateDayStreak(activity: UserActivitySnapshot): number {
  const articleCount = activity.accessed.article?.size ?? 0;
  const protocolCount = activity.protocolSlugsInProgress.size;
  const downloadCount = activity.downloadedLibrarySlugs.size;
  const total = articleCount + protocolCount + downloadCount;
  if (total >= 7) return 7;
  if (total >= 3) return 3;
  if (total >= 1) return 1;
  return 0;
}

function estimateMonthlyActiveDays(activity: UserActivitySnapshot): number {
  const sets = [
    activity.accessed.article,
    activity.accessed.protocol,
    activity.accessed.library,
  ];
  let total = activity.downloadedLibrarySlugs.size;
  for (const set of sets) {
    if (set) total += set.size;
  }
  return Math.min(total, 30);
}

function resolveUnlockedAchievements(input: {
  profileComplete: boolean;
  activity: UserActivitySnapshot;
  trails: TrailProgress[];
  progress: JourneyProgressStats;
}): Set<AchievementId> {
  const unlocked = new Set<AchievementId>();

  if (input.profileComplete) unlocked.add("profile-complete");
  if ((input.activity.accessed.article?.size ?? 0) > 0) unlocked.add("first-article");
  if (input.activity.protocolSlugsInProgress.size > 0) unlocked.add("first-protocol");
  if (input.activity.downloadedLibrarySlugs.size > 0) unlocked.add("first-download");
  if (input.progress.trailsStarted > 0) unlocked.add("trail-started");
  if (input.progress.trailsCompleted > 0) unlocked.add("trail-completed");

  const streak = estimateDayStreak(input.activity);
  if (streak >= 7) unlocked.add("week-streak");

  const monthlyDays = estimateMonthlyActiveDays(input.activity);
  if (monthlyDays >= 15) unlocked.add("month-active");

  return unlocked;
}

function buildPersonalGoals(progress: JourneyProgressStats): PersonalGoal[] {
  return [
    {
      id: "materials",
      label: "Materiais concluídos",
      target: 10,
      current: progress.materialsCompleted,
      unit: "itens",
    },
    {
      id: "trails",
      label: "Trilhas concluídas",
      target: 3,
      current: progress.trailsCompleted,
      unit: "trilhas",
    },
    {
      id: "evolution",
      label: "Evolução da jornada",
      target: 100,
      current: progress.overallPercent,
      unit: "%",
    },
  ];
}

export function computeLoyaltySnapshot(input: {
  profileComplete: boolean;
  activity: UserActivitySnapshot;
  trails: TrailProgress[];
  progress: JourneyProgressStats;
}): LoyaltySnapshot {
  const unlockedIds = resolveUnlockedAchievements(input);
  const achievements = ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: unlockedIds.has(a.id),
  }));

  const monthlyActiveDays = estimateMonthlyActiveDays(input.activity);
  const personalGoals = buildPersonalGoals(input.progress);
  const evolutionGoal = personalGoals.find((g) => g.id === "evolution");
  const monthlyProgressPercent = evolutionGoal?.current ?? 0;

  return {
    achievements,
    unlockedCount: unlockedIds.size,
    dayStreak: estimateDayStreak(input.activity),
    monthlyActiveDays,
    personalGoals,
    monthlyProgressPercent,
  };
}
