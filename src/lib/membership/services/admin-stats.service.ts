import { CLUB_PRICING } from "@/lib/payments/pricing";
import {
  fetchMembershipPlansForAdmin,
  fetchUserMembershipsForAdmin,
} from "./memberships.service";

export interface MembershipAdminStats {
  totalMembers: number;
  premiumActiveMembers: number;
  plansRegistered: number;
  pendingSubscriptions: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  expiredSubscriptions: number;
  estimatedMonthlyRevenueCents: number;
  estimatedAnnualRevenueCents: number;
  conversionRatePercent: number;
}

export async function getMembershipAdminStats(): Promise<MembershipAdminStats> {
  const members = await fetchUserMembershipsForAdmin();
  const plans = await fetchMembershipPlansForAdmin();

  const active = members.filter((m) =>
    ["active", "trialing"].includes(m.status),
  );
  const canceled = members.filter((m) => m.status === "canceled");
  const expired = members.filter((m) => m.status === "expired");
  const pending = members.filter((m) => m.status === "pending");

  const premiumActive = active.filter((m) => m.planSlug !== "gratuito");
  const uniqueUserIds = new Set(members.map((m) => m.userId));

  const monthlyActive = premiumActive.filter(
    (m) => m.planSlug === "premium-mensal",
  ).length;
  const annualActive = premiumActive.filter(
    (m) => m.planSlug === "premium-anual",
  ).length;

  const estimatedMonthlyRevenueCents =
    monthlyActive * CLUB_PRICING.premiumMonthly.amountCents +
    Math.round((annualActive * CLUB_PRICING.premiumAnnual.amountCents) / 12);

  const estimatedAnnualRevenueCents =
    monthlyActive * CLUB_PRICING.premiumMonthly.amountCents * 12 +
    annualActive * CLUB_PRICING.premiumAnnual.amountCents;

  const totalMembers = uniqueUserIds.size;
  const conversionRatePercent =
    totalMembers > 0
      ? Math.round((premiumActive.length / totalMembers) * 1000) / 10
      : 0;

  return {
    totalMembers,
    premiumActiveMembers: premiumActive.length,
    plansRegistered: plans.length,
    pendingSubscriptions: pending.length,
    activeSubscriptions: active.length,
    canceledSubscriptions: canceled.length,
    expiredSubscriptions: expired.length,
    estimatedMonthlyRevenueCents,
    estimatedAnnualRevenueCents,
    conversionRatePercent,
  };
}
