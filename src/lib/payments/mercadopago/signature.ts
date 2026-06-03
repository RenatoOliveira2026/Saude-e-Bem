import { createHmac, timingSafeEqual } from "crypto";
import { getMercadoPagoWebhookSecret, isMercadoPagoConfigured, isStubModeEnabled } from "../config";

export interface WebhookSignatureInput {
  headers: Headers;
  queryDataId: string | null;
  rawBody: string;
}

function parseSignatureHeader(header: string | null): { ts: string; v1: string } | null {
  if (!header) return null;

  const parts = Object.fromEntries(
    header.split(",").map((part) => {
      const eqIndex = part.indexOf("=");
      if (eqIndex === -1) return [part.trim(), ""];
      return [part.slice(0, eqIndex).trim(), part.slice(eqIndex + 1).trim()];
    }),
  );

  if (!parts.ts || !parts.v1) return null;
  return { ts: parts.ts, v1: parts.v1 };
}

/**
 * Valida assinatura x-signature do Mercado Pago.
 * @see https://www.mercadopago.com.br/developers/en/docs/your-integrations/notifications/webhooks
 */
export function verifyMercadoPagoWebhookSignature(
  input: WebhookSignatureInput,
): boolean {
  const secret = getMercadoPagoWebhookSecret();

  if (!secret) {
    return isStubModeEnabled() || !isMercadoPagoConfigured();
  }

  const requestId = input.headers.get("x-request-id");
  const parsed = parseSignatureHeader(input.headers.get("x-signature"));

  if (!requestId || !parsed) return false;

  const dataId = input.queryDataId ?? extractDataIdFromBody(input.rawBody);
  if (!dataId) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${parsed.ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(parsed.v1), Buffer.from(expected));
  } catch {
    return parsed.v1 === expected;
  }
}

function extractDataIdFromBody(rawBody: string): string | null {
  try {
    const payload = JSON.parse(rawBody) as {
      data?: { id?: string | number };
      id?: string | number;
    };
    const id = payload.data?.id ?? payload.id;
    return id != null ? String(id) : null;
  } catch {
    return null;
  }
}
