import { processPendingAutomationSteps } from "@/lib/email-automation";
import { isCronAuthorized } from "@/lib/cron/auth";
import { NextResponse } from "next/server";

function getAutomationCronSecret(): string | null {
  return process.env.LEAD_AUTOMATION_CRON_SECRET?.trim() || null;
}

export const dynamic = "force-dynamic";

async function handle(request: Request) {
  if (!isCronAuthorized(request, { extraSecrets: [getAutomationCronSecret()] })) {
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

export const GET = handle;
export const POST = handle;
