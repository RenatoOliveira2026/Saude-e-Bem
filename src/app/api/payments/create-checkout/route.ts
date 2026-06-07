import { createPremiumCheckout } from "@/lib/payments/mercadopago/checkout";
import { assertProductionCheckoutReady } from "@/lib/payments/config";
import { isCheckoutPlanId } from "@/lib/payments/plans";
import { getCurrentUser, getUserProfile } from "@/lib/auth/session";
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
      error instanceof Error ? error.message : "Erro ao criar checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
