import {
  processMercadoPagoWebhook,
  verifyMercadoPagoWebhookSignature,
} from "@/lib/payments/mercadopago/webhook";
import {
  isMercadoPagoIpnNotification,
  resolveIpnQueryParams,
} from "@/lib/payments/mercadopago/ipn";
import { isMercadoPagoConfigured } from "@/lib/payments/config";
import type { MercadoPagoWebhookPayload } from "@/lib/payments/types";
import { NextResponse } from "next/server";

async function handleMercadoPagoNotification(request: Request) {
  const url = new URL(request.url);
  const { queryType, queryDataId, queryTopic, queryId } =
    resolveIpnQueryParams(url);
  const rawBody =
    request.method === "GET" ? "" : await request.clone().text();

  let payload: MercadoPagoWebhookPayload = {};
  if (rawBody) {
    try {
      payload = JSON.parse(rawBody) as MercadoPagoWebhookPayload;
    } catch {
      return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
    }
  }

  const signatureOk = verifyMercadoPagoWebhookSignature({
    headers: request.headers,
    queryDataId: queryDataId ?? queryId,
    rawBody,
  });

  const ipnOk =
    isMercadoPagoConfigured() &&
    isMercadoPagoIpnNotification({
      method: request.method,
      headers: request.headers,
      queryType,
      queryDataId,
      queryTopic,
      queryId,
      payload,
    });

  if (!signatureOk && !ipnOk) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
  }

  const effectiveType =
    queryType ??
    queryTopic ??
    payload.type ??
    payload.action ??
    null;
  const effectiveDataId =
    queryDataId ??
    queryId ??
    payload.data?.id?.toString() ??
    null;

  try {
    const result = await processMercadoPagoWebhook({
      payload,
      queryType: effectiveType,
      queryDataId: effectiveDataId,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao processar webhook.";
    console.error("[payments/webhook]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return handleMercadoPagoNotification(request);
}

/** IPN legado do Mercado Pago: GET ?topic=payment&id={payment_id} */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const { queryTopic, queryId } = resolveIpnQueryParams(url);

  if (queryTopic && queryId) {
    return handleMercadoPagoNotification(request);
  }

  return NextResponse.json({
    ok: true,
    message: "Webhook Mercado Pago — use POST ou GET IPN (?topic=payment&id=).",
  });
}
