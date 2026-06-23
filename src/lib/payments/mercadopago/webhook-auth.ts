import type { MercadoPagoWebhookPayload } from "../types";
import {
  getMercadoPagoWebhookSecret,
  isMercadoPagoConfigured,
  isStubModeEnabled,
} from "../config";
import { isMercadoPagoIpnNotification } from "./ipn";
import { verifyMercadoPagoWebhookSignature } from "./signature";

export interface WebhookAuthInput {
  method: string;
  headers: Headers;
  queryType: string | null;
  queryDataId: string | null;
  queryTopic: string | null;
  queryId: string | null;
  payload: MercadoPagoWebhookPayload;
  rawBody: string;
}

export interface WebhookAuthResult {
  authorized: boolean;
  reason: string;
}

function isCheckoutProGetIpn(input: WebhookAuthInput): boolean {
  if (input.method !== "GET" || !input.queryTopic || !input.queryId) {
    return false;
  }
  const topic = input.queryTopic.toLowerCase();
  return topic.includes("payment") || topic.includes("preapproval");
}

/** Autoriza notificações MP — HMAC, IPN Checkout Pro ou fallback sem secret (Fase 8.5). */
export function authorizeMercadoPagoWebhook(
  input: WebhookAuthInput,
): WebhookAuthResult {
  if (!isMercadoPagoConfigured()) {
    return {
      authorized: isStubModeEnabled(),
      reason: isStubModeEnabled() ? "stub_mode" : "mp_not_configured",
    };
  }

  const secret = getMercadoPagoWebhookSecret();
  const hasSignature = Boolean(input.headers.get("x-signature"));

  if (hasSignature && secret) {
    const signatureOk = verifyMercadoPagoWebhookSignature({
      headers: input.headers,
      queryDataId: input.queryDataId ?? input.queryId,
      rawBody: input.rawBody,
    });
    if (signatureOk) {
      return { authorized: true, reason: "signature_valid" };
    }
  }

  if (isCheckoutProGetIpn(input)) {
    return { authorized: true, reason: "checkout_pro_get_ipn" };
  }

  const ipnOk = isMercadoPagoIpnNotification({
    method: input.method,
    headers: input.headers,
    queryType: input.queryType,
    queryDataId: input.queryDataId,
    queryTopic: input.queryTopic,
    queryId: input.queryId,
    payload: input.payload,
  });

  if (ipnOk) {
    if (!hasSignature) {
      return { authorized: true, reason: "ipn_unsigned" };
    }
    if (!secret) {
      return { authorized: true, reason: "signed_header_but_no_secret_ipn" };
    }
    return { authorized: true, reason: "ipn_fallback_after_bad_signature" };
  }

  return {
    authorized: false,
    reason: hasSignature ? "signature_invalid" : "not_authorized",
  };
}
