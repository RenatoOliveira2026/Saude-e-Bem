import { processPendingAutomationSteps } from "@/lib/email-automation";
import { NextResponse } from "next/server";

function getAutomationCronSecret(): string | null {
  return process.env.LEAD_AUTOMATION_CRON_SECRET?.trim() || null;
}

export async function POST(request: Request) {
  const secret = getAutomationCronSecret();
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const querySecret = new URL(request.url).searchParams.get("secret");

  if (!secret) {
    return NextResponse.json(
      { error: "LEAD_AUTOMATION_CRON_SECRET não configurado." },
      { status: 503 },
    );
  }

  if (bearer !== secret && querySecret !== secret) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const result = await processPendingAutomationSteps();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao processar automação.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Cron de automação — use POST com LEAD_AUTOMATION_CRON_SECRET.",
  });
}
