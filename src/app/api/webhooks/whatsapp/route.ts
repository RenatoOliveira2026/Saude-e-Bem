import { getWhatsAppConfig } from "@/lib/whatsapp/config";
import { verifyWhatsAppWebhookSignature } from "@/lib/whatsapp/signature";
import { processWhatsAppWebhook } from "@/lib/whatsapp/inbound.service";
import type { WhatsAppWebhookPayload } from "@/lib/whatsapp/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const { webhookVerifyToken } = getWhatsAppConfig();

  if (mode === "subscribe" && token === webhookVerifyToken && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verificação falhou." }, { status: 403 });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyWhatsAppWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }

  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  try {
    const result = await processWhatsAppWebhook(payload);
    return NextResponse.json({ ok: true, processed: result.processed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro no webhook.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
