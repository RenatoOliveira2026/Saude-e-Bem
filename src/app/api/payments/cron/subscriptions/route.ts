import { isCronAuthorized } from "@/lib/cron/auth";
import { expireDueSubscriptions } from "@/lib/payments/services/subscription-lifecycle.service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Cron diário (Vercel chama com GET): expira assinaturas e memberships vencidas. */
async function handle(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const expiredCount = await expireDueSubscriptions({ force: true });
    return NextResponse.json({
      ok: true,
      expiredCount,
      message: `${expiredCount} assinatura(s) ou plano(s) expirado(s).`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao expirar assinaturas.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
