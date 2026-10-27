import {
  processDueWhatsAppAutomations,
  processRenewalReminders,
} from "@/lib/whatsapp/automation.service";
import { getWhatsAppConfig } from "@/lib/whatsapp/config";
import { isCronAuthorized } from "@/lib/cron/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function handle(request: Request) {
  const { cronSecret } = getWhatsAppConfig();

  if (!isCronAuthorized(request, { extraSecrets: [cronSecret] })) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const [automations, renewals] = await Promise.all([
      processDueWhatsAppAutomations(),
      processRenewalReminders(),
    ]);

    return NextResponse.json({
      ok: true,
      automationsProcessed: automations,
      renewalRemindersSent: renewals,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro no cron WhatsApp.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
