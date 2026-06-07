import {
  processDueWhatsAppAutomations,
  processRenewalReminders,
} from "@/lib/whatsapp/automation.service";
import { getWhatsAppConfig } from "@/lib/whatsapp/config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  const { cronSecret } = getWhatsAppConfig();

  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
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
