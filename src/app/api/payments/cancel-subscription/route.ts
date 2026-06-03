import { createPaymentsAdminClient } from "@/lib/payments/admin-client";
import { cancelUserSubscription } from "@/lib/payments/services/subscriptions.service";
import { getCurrentUser } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let immediate = false;
  try {
    const body = await request.json();
    immediate = body?.immediate === true;
  } catch {
    // default: cancel at period end
  }

  const admin = createPaymentsAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Serviço de pagamentos indisponível." },
      { status: 503 },
    );
  }

  try {
    const result = await cancelUserSubscription(admin, user.id, immediate);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao cancelar assinatura.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
