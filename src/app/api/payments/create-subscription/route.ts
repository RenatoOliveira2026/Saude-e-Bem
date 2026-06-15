import { getCurrentUser, getUserProfile } from "@/lib/auth/session";
import { createPaymentsAdminClient } from "@/lib/payments/admin-client";
import { assertProductionCheckoutReady } from "@/lib/payments/config";
import { assertUserCanSubscribe } from "@/lib/payments/guards";
import { createPremiumCheckout } from "@/lib/payments/mercadopago/checkout";
import {
  isSubscriptionCheckoutPlanId,
  type SubscriptionCheckoutPlanId,
} from "@/lib/payments/pricing";
import type { PaymentMethod } from "@/lib/payments/types";
import { NextResponse } from "next/server";

function defaultPaymentMethod(plan: SubscriptionCheckoutPlanId): PaymentMethod {
  return plan === "premium_monthly" ? "credit_card" : "credit_card";
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let body: { plan?: string; paymentMethod?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const plan = body.plan ?? "premium_monthly";
  if (!isSubscriptionCheckoutPlanId(plan)) {
    return NextResponse.json(
      { error: "Plano inválido. Use premium_monthly ou premium_annual." },
      { status: 400 },
    );
  }

  const paymentMethod = (body.paymentMethod as PaymentMethod) ?? defaultPaymentMethod(plan);
  const validMethods: PaymentMethod[] = ["pix", "credit_card", "ticket"];
  if (!validMethods.includes(paymentMethod)) {
    return NextResponse.json(
      { error: "Método de pagamento inválido." },
      { status: 400 },
    );
  }

  try {
    assertProductionCheckoutReady();
    const admin = createPaymentsAdminClient();
    if (!admin) {
      return NextResponse.json(
        { error: "Serviço de pagamentos indisponível." },
        { status: 503 },
      );
    }

    await assertUserCanSubscribe(admin, user.id);

    const profile = await getUserProfile(user.id);
    const result = await createPremiumCheckout({
      userId: user.id,
      email: user.email ?? "",
      name: profile.profile?.name,
      request: { paymentMethod, plan },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao criar assinatura.";
    const status = message.includes("já possui") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
