import {
  processMercadoPagoWebhook,
  verifyMercadoPagoWebhookSignature,
} from "@/lib/payments/mercadopago/webhook";
import type { MercadoPagoWebhookPayload } from "@/lib/payments/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const queryType = url.searchParams.get("type");
  const queryDataId = url.searchParams.get("data.id");
  const rawBody = await request.text();

  if (
    !verifyMercadoPagoWebhookSignature({
      headers: request.headers,
      queryDataId,
      rawBody,
    })
  ) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }

  let payload: MercadoPagoWebhookPayload;
  try {
    payload = rawBody
      ? (JSON.parse(rawBody) as MercadoPagoWebhookPayload)
      : {};
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  try {
    const result = await processMercadoPagoWebhook({
      payload,
      queryType,
      queryDataId,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao processar webhook.";
    console.error("[payments/webhook]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Webhook Mercado Pago — use POST.",
  });
}
