import { expireDueSubscriptions } from "@/lib/payments/services/subscription-lifecycle.service";
import { getPaymentsCronSecret } from "@/lib/payments/config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = getPaymentsCronSecret();
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const querySecret = new URL(request.url).searchParams.get("secret");

  if (!secret) {
    return NextResponse.json(
      { error: "PAYMENTS_CRON_SECRET não configurado." },
      { status: 503 },
    );
  }

  if (bearer !== secret && querySecret !== secret) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const expiredCount = await expireDueSubscriptions();
    return NextResponse.json({
      ok: true,
      expiredCount,
      message: `${expiredCount} assinatura(s) expirada(s) ou cancelada(s).`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao expirar assinaturas.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Cron de assinaturas — use POST com PAYMENTS_CRON_SECRET.",
  });
}
