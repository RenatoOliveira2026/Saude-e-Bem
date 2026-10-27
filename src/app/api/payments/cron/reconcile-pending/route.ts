import { reconcilePendingPayments } from "@/lib/payments/mercadopago/reconcile";
import { isCronAuthorized } from "@/lib/cron/auth";
import { NextResponse } from "next/server";

/** Cron — reconcilia pagamentos pending com PIX aprovado no MP (Fase 8.5). */
export const dynamic = "force-dynamic";

async function handle(request: Request) {
  if (!isCronAuthorized(request, { allowServiceRole: true })) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let limit = 25;
  try {
    const body = request.method === "POST" ? await request.json() : null;
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

export const GET = handle;
export const POST = handle;
