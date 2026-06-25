import type { IconName } from "@/components/icons";

export interface OnboardingRecommendation {
  id: string;
  type: "trail" | "protocol" | "article";
  title: string;
  description: string;
  href: string;
  icon: IconName;
  badge?: string;
}

export interface OnboardingPlan {
  goalKey: string | null;
  goalLabel: string | null;
  trail: OnboardingRecommendation | null;
  protocol: OnboardingRecommendation | null;
  article: OnboardingRecommendation | null;
}

export interface OnboardingData {
  displayName: string;
  hasGoal: boolean;
  profileComplete: boolean;
  plan: OnboardingPlan;
}

export const ONBOARDING_STORAGE_KEY = "saude-bem:onboarding-complete";
