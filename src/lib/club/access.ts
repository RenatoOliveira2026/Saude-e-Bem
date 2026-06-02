import { isAdminUser } from "@/lib/admin/session";
import { getCurrentUser } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { SubscriptionRow } from "@/lib/supabase/types";
import type {
  ClubMembership,
  PremiumAccessContext,
  Subscription,
} from "./types";

type SubscriptionSelectRow = Pick<
  SubscriptionRow,
  | "id"
  | "user_id"
  | "plan"
  | "status"
  | "provider"
  | "current_period_start"
  | "current_period_end"
  | "canceled_at"
  | "created_at"
  | "updated_at"
>;

function mapSubscriptionRow(row: SubscriptionSelectRow): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    plan: row.plan,
    status: row.status,
    provider: row.provider,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    canceledAt: row.canceled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildMembership(
  subscription: Subscription | null,
  profileTier: "free" | "premium" | null | undefined,
): ClubMembership {
  const activeFromSubscription =
    subscription &&
    subscription.plan === "premium" &&
    (subscription.status === "active" || subscription.status === "trialing") &&
    (!subscription.currentPeriodEnd ||
      new Date(subscription.currentPeriodEnd) > new Date());

  const isPremium = Boolean(activeFromSubscription) || profileTier === "premium";

  return {
    plan: isPremium ? "premium" : "free",
    isPremium,
    subscription,
    expiresAt: subscription?.currentPeriodEnd ?? null,
    status: subscription?.status ?? "none",
    provider: subscription?.provider ?? null,
  };
}

/** Assinatura ativa ou mais recente do usuário. */
export async function fetchUserSubscription(
  userId: string,
): Promise<Subscription | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      "id, user_id, plan, status, provider, current_period_start, current_period_end, canceled_at, created_at, updated_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? mapSubscriptionRow(data) : null;
}

/** Status de membro premium (assinatura + tier do profile). */
export async function getClubMembership(userId: string): Promise<ClubMembership> {
  if (!isSupabaseConfigured()) {
    return {
      plan: "free",
      isPremium: false,
      subscription: null,
      expiresAt: null,
      status: "none",
      provider: null,
    };
  }

  const supabase = await createClient();
  const [subscriptionResult, profileResult] = await Promise.all([
    supabase
      .from("subscriptions")
      .select(
        "id, user_id, plan, status, provider, current_period_start, current_period_end, canceled_at, created_at, updated_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("membership_tier")
      .eq("id", userId)
      .maybeSingle(),
  ]);

  if (subscriptionResult.error) throw subscriptionResult.error;
  if (profileResult.error) throw profileResult.error;

  const subscription = subscriptionResult.data
    ? mapSubscriptionRow(subscriptionResult.data)
    : null;

  return buildMembership(
    subscription,
    profileResult.data?.membership_tier as "free" | "premium" | undefined,
  );
}

/** Verifica premium via RPC (fallback para tier local). */
export async function userHasActivePremium(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("user_has_active_premium", {
    p_user_id: userId,
  });

  if (error) {
    const membership = await getClubMembership(userId);
    return membership.isPremium;
  }

  return data === true;
}

/** Admins têm acesso total a conteúdo premium. */
export async function canAccessPremiumContent(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  if (await isAdminUser(user.email ?? "", user.id)) {
    return true;
  }

  return userHasActivePremium(user.id);
}

/** Contexto para páginas de conteúdo com gate premium. */
export async function resolvePremiumAccess(
  isPremiumContent: boolean,
): Promise<PremiumAccessContext> {
  if (!isPremiumContent) {
    return { isLoggedIn: false, isPremium: false, canAccess: true };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { isLoggedIn: false, isPremium: false, canAccess: false };
  }

  const isPremium = await canAccessPremiumContent();
  return {
    isLoggedIn: true,
    isPremium,
    canAccess: isPremium,
  };
}

export function getPremiumUpgradeHref(isLoggedIn: boolean): string {
  return isLoggedIn ? routes.clubePremium : `${routes.entrar}?redirect=${encodeURIComponent(routes.clubePremium)}`;
}

/** Marca entrada na área de membros (idempotente). */
export async function touchClubJoined(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = await createClient();
  await supabase.rpc("touch_club_joined", { p_user_id: userId });
}
