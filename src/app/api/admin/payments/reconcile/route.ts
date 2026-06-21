import { getAdminSession } from "@/lib/admin/session";
import { getPaymentsCronSecret } from "@/lib/payments/config";
import { reconcilePendingPayments } from "@/lib/payments/mercadopago/reconcile";
import { NextResponse } from "next/server";

function isAuthorized(request: Request): boolean {
  const cronSecret = getPaymentsCronSecret();
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    const bearer = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const querySecret = new URL(request.url).searchParams.get("secret");
    if (bearer === cronSecret || querySecret === cronSecret) {
      return true;
    }
  }

  return false;
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session && !isAuthorized(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: {
    limit?: number;
    externalReference?: string;
    paymentId?: string;
  } = {};

  try {
    body = await request.json();
  } catch {
    // corpo vazio — reconcilia lote padrão
  }

  try {
    const results = await reconcilePendingPayments({
      limit: body.limit,
      externalReference: body.externalReference?.trim(),
      paymentId: body.paymentId?.trim(),
    });

    const reconciled = results.filter((r) => r.ok).length;

    return NextResponse.json({
      ok: true,
      reconciled,
      total: results.length,
      results,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao reconciliar pagamentos.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message:
      "POST — reconcilia pagamentos pending via Mercado Pago (admin logado ou PAYMENTS_CRON_SECRET).",
  });
}
