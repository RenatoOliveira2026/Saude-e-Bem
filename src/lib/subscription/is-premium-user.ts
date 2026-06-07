import { isAdminUser } from "@/lib/admin/session";
import { getCurrentUser } from "@/lib/auth/session";
import { userHasActivePremium } from "@/lib/club/access";
import type { ClubMembership } from "@/lib/club/types";
import type { ProfilePlan } from "./plan.types";
import { isValidProfilePlan } from "./plan.types";

/** Verifica se o plano do perfil concede acesso premium. */
export function isPremiumPlan(plan: ProfilePlan | string | null | undefined): boolean {
  return (
    plan === "premium_monthly" ||
    plan === "premium_quarterly" ||
    plan === "premium_annual" ||
    plan === "admin"
  );
}

type PremiumCheckInput =
  | ProfilePlan
  | string
  | ClubMembership
  | boolean
  | null
  | undefined;

/**
 * Helper síncrono — aceita plano, membership ou boolean.
 * Para checagem server-side completa, use `resolveIsPremiumUser()`.
 */
export function isPremiumUser(input: PremiumCheckInput): boolean {
  if (typeof input === "boolean") return input;
  if (!input) return false;

  if (typeof input === "object" && "isPremium" in input) {
    return input.isPremium === true;
  }

  if (typeof input === "string" && isValidProfilePlan(input)) {
    return isPremiumPlan(input);
  }

  return false;
}

/** Resolve premium da sessão atual (RPC + admin + plano). */
export async function resolveIsPremiumUser(userId?: string): Promise<boolean> {
  const user = userId ? null : await getCurrentUser();
  const id = userId ?? user?.id;
  if (!id) return false;

  if (!userId && user && (await isAdminUser(user.email ?? "", user.id))) {
    return true;
  }

  return userHasActivePremium(id);
}
