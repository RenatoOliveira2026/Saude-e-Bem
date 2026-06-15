import { getCurrentUser } from "@/lib/auth/session";
import { getClubMembership } from "@/lib/club/access";
import { createPaymentsAdminClient } from "@/lib/payments/admin-client";
import { userHasActiveSubscription } from "@/lib/payments/guards";
import { fetchUserPayments } from "@/lib/payments/services/payments.service";
import { resolveNextRenewal } from "@/lib/subscription";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const admin = createPaymentsAdminClient();
  const [membership, payments, hasActive] = await Promise.all([
    getClubMembership(user.id),
    fetchUserPayments(user.id),
    admin ? userHasActiveSubscription(admin, user.id) : Promise.resolve(false),
  ]);

  const latestPayment = payments[0] ?? null;

  return NextResponse.json({
    userId: user.id,
    isPremium: membership.isPremium,
    hasActiveSubscription: hasActive,
    profilePlan: membership.profilePlan,
    membershipStatus: membership.status,
    subscription: membership.subscription,
    nextRenewal: resolveNextRenewal(membership),
    expiresAt: membership.expiresAt,
    latestPayment: latestPayment
      ? {
          id: latestPayment.id,
          status: latestPayment.status,
          amountCents: latestPayment.amountCents,
          externalReference: latestPayment.externalReference,
          createdAt: latestPayment.createdAt,
        }
      : null,
  });
}
