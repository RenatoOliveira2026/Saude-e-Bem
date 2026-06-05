/** Plano persistido em `profiles.plan` (Fase 4.7). */
export type ProfilePlan =
  | "free"
  | "premium_monthly"
  | "premium_annual"
  | "admin";

export const PROFILE_PLANS: ProfilePlan[] = [
  "free",
  "premium_monthly",
  "premium_annual",
  "admin",
];

export function isValidProfilePlan(value: string | null | undefined): value is ProfilePlan {
  return PROFILE_PLANS.includes(value as ProfilePlan);
}

export function normalizeProfilePlan(
  value: string | null | undefined,
  membershipTier?: "free" | "premium" | null,
): ProfilePlan {
  if (isValidProfilePlan(value)) return value;
  if (membershipTier === "premium") return "premium_monthly";
  return "free";
}
