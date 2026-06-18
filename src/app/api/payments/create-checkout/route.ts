import { getCurrentUser, getUserProfile } from "@/lib/auth/session";
import {
  assertBillingProfileComplete,
  BILLING_PROFILE_INCOMPLETE_CODE,
  billingProfileRedirectUrl,
} from "@/lib/billing/guards";
import { createPaymentsAdminClient } from "@/lib/payments/admin-client";
import { assertProductionCheckoutReady } from "@/lib/payments/config";
import { assertUserCanSubscribe, isActiveSubscriptionConflictError } from "@/lib/payments/guards";
import { createPremiumCheckout } from "@/lib/payments/mercadopago/checkout";
import { isCheckoutPlanId } from "@/lib/payments/plans";
import type { PaymentMethod } from "@/lib/payments/types";
import { NextResponse } from "next/server";

const validMethods: PaymentMethod[] = ["pix", "credit_card", "ticket"];

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let body: { paymentMethod?: string; plan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const paymentMethod = body.paymentMethod as PaymentMethod;
  if (!paymentMethod || !validMethods.includes(paymentMethod)) {
    return NextResponse.json(
      { error: "Método de pagamento inválido. Use pix, credit_card ou ticket." },
      { status: 400 },
    );
  }

  const plan = body.plan ?? "premium_monthly";
  if (!isCheckoutPlanId(plan)) {
    return NextResponse.json(
      {
        error:
          "Plano inválido. Use premium_monthly, premium_quarterly ou premium_annual.",
      },
      { status: 400 },
    );
  }

  try {
    assertProductionCheckoutReady();
    const admin = createPaymentsAdminClient();
    if (admin) {
      await assertUserCanSubscribe(admin, user.id);
    }
    const profile = await getUserProfile(user.id);
    assertBillingProfileComplete(profile.profile);

    const result = await createPremiumCheckout({
      userId: user.id,
      email: user.email ?? "",
      name: profile.profile?.full_name ?? profile.profile?.name,
      profile: profile.profile,
      request: { paymentMethod, plan },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao criar checkout.";
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === BILLING_PROFILE_INCOMPLETE_CODE
    ) {
      return NextResponse.json(
        {
          error: message,
          code: BILLING_PROFILE_INCOMPLETE_CODE,
          redirectUrl: billingProfileRedirectUrl("/assinar"),
        },
        { status: 428 },
      );
    }
    const status = isActiveSubscriptionConflictError(message) ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
