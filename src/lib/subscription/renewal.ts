import type { ClubMembership } from "@/lib/club/types";
import type { ProfilePlan } from "./plan.types";

/** Próxima renovação mock quando não há `current_period_end` no banco. */
export function mockNextRenewalDate(profilePlan: ProfilePlan): string {
  const days =
    profilePlan === "premium_annual"
      ? 365
      : profilePlan === "premium_quarterly"
        ? 90
        : 30;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function resolveNextRenewal(membership: ClubMembership): string | null {
  if (!membership.isPremium) return null;
  if (membership.expiresAt) return membership.expiresAt;
  if (membership.profilePlan === "admin") return null;
  return mockNextRenewalDate(membership.profilePlan);
}
