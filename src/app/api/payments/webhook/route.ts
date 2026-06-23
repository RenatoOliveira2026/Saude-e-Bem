import {
  processMercadoPagoWebhook,
} from "@/lib/payments/mercadopago/webhook";
import { authorizeMercadoPagoWebhook } from "@/lib/payments/mercadopago/webhook-auth";
import { resolveIpnQueryParams } from "@/lib/payments/mercadopago/ipn";
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

  const auth = authorizeMercadoPagoWebhook({
    method: request.method,
    headers: request.headers,
    queryType,
    queryDataId,
    queryTopic,
    queryId,
    payload,
    rawBody,
  });

  if (!auth.authorized) {
    console.error("[payments/webhook] 401:", auth.reason, {
      method: request.method,
      topic: queryTopic ?? queryType ?? payload.type,
      id: queryId ?? queryDataId ?? payload.data?.id,
      hasSignature: Boolean(request.headers.get("x-signature")),
    });
    return NextResponse.json(
      { error: "Assinatura inválida.", reason: auth.reason },
      { status: 401 },
    );
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
    return NextResponse.json({ ...result, auth: auth.reason });
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
