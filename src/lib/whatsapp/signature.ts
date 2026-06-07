import { createHmac, timingSafeEqual } from "crypto";
import { getWhatsAppConfig } from "./config";

export function verifyWhatsAppWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  const { appSecret } = getWhatsAppConfig();
  if (!appSecret) {
    return process.env.NODE_ENV === "development";
  }
  if (!signatureHeader?.startsWith("sha256=")) return false;

  const expected = createHmac("sha256", appSecret).update(rawBody).digest("hex");
  const received = signatureHeader.slice("sha256=".length);

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
  } catch {
    return false;
  }
}
