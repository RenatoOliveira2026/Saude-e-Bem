import { reconcilePendingPayments } from "@/lib/payments/mercadopago/reconcile";
import { getPaymentsCronSecret } from "@/lib/payments/config";
import { NextResponse } from "next/server";

function isAuthorized(request: Request): boolean {
  const secret = getPaymentsCronSecret();
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const querySecret = new URL(request.url).searchParams.get("secret");

  if (secret && (bearer === secret || querySecret === secret)) {
    return true;
  }
  if (serviceRole && bearer === serviceRole) {
    return true;
  }
  return false;
}

/** Cron — reconcilia pagamentos pending com PIX aprovado no MP (Fase 8.5). */
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let limit = 25;
  try {
    const body = await request.json();
    if (typeof body?.limit === "number") limit = body.limit;
  } catch {
    // corpo vazio
  }

  try {
    const results = await reconcilePendingPayments({ limit });
    const reconciled = results.filter((r) => r.ok).length;
    return NextResponse.json({
      ok: true,
      reconciled,
      total: results.length,
      results,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao reconciliar.";
    console.error("[cron/reconcile-pending]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message:
      "Cron reconcile pending — POST com PAYMENTS_CRON_SECRET ou SUPABASE_SERVICE_ROLE_KEY.",
  });
}
