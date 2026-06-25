import type { IconName } from "@/components/icons";

export type AchievementId =
  | "first-article"
  | "first-protocol"
  | "first-download"
  | "trail-started"
  | "trail-completed"
  | "profile-complete"
  | "week-streak"
  | "month-active";

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: IconName;
  /** Medalha exibida quando desbloqueada */
  medalLabel: string;
}

export interface PersonalGoal {
  id: string;
  label: string;
  target: number;
  current: number;
  unit: string;
}

export interface LoyaltySnapshot {
  achievements: (Achievement & { unlocked: boolean; unlockedAt?: string })[];
  unlockedCount: number;
  dayStreak: number;
  monthlyActiveDays: number;
  personalGoals: PersonalGoal[];
  monthlyProgressPercent: number;
}
