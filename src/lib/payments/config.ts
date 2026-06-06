const PLACEHOLDER_TOKEN_PATTERNS = [
  "your-access-token",
  "COLE-SEU-TOKEN",
  "test-your-token",
] as const;

export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3001";

  return url.replace(/\/+$/, "");
}

export function isMercadoPagoConfigured(): boolean {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!token) return false;
  return !PLACEHOLDER_TOKEN_PATTERNS.some((p) =>
    token.toLowerCase().includes(p.toLowerCase()),
  );
}

export function getMercadoPagoAccessToken(): string | null {
  if (!isMercadoPagoConfigured()) return null;
  return process.env.MERCADOPAGO_ACCESS_TOKEN!.trim();
}

export function getMercadoPagoPublicKey(): string | null {
  const key = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY?.trim();
  return key || null;
}

export function getMercadoPagoWebhookSecret(): string | null {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim();
  return secret || null;
}

export function isWebhookSecretConfigured(): boolean {
  return Boolean(getMercadoPagoWebhookSecret());
}

/** Stub explícito apenas em dev quando MP não está configurado. */
export function isStubModeEnabled(): boolean {
  return (
    process.env.MERCADOPAGO_STUB_MODE === "1" &&
    process.env.NODE_ENV !== "production"
  );
}

export function shouldUseSandboxCheckout(): boolean {
  if (process.env.MERCADOPAGO_USE_SANDBOX === "1") return true;
  const token = getMercadoPagoAccessToken();
  return token?.startsWith("TEST-") ?? false;
}

export function getPaymentsCronSecret(): string | null {
  return process.env.PAYMENTS_CRON_SECRET?.trim() || null;
}

/** Checkout real habilitado quando MP está configurado (não stub). */
export function isRealCheckoutEnabled(): boolean {
  return isMercadoPagoConfigured() && !isStubModeEnabled();
}

export function assertProductionCheckoutReady(): void {
  if (process.env.NODE_ENV === "production" && !isMercadoPagoConfigured()) {
    throw new Error(
      "MERCADOPAGO_ACCESS_TOKEN é obrigatório em produção para checkout real.",
    );
  }
}

export function getPaymentsConfigSummary() {
  return {
    mercadoPagoConfigured: isMercadoPagoConfigured(),
    realCheckoutEnabled: isRealCheckoutEnabled(),
    webhookSecretConfigured: isWebhookSecretConfigured(),
    stubMode: isStubModeEnabled(),
    sandbox: shouldUseSandboxCheckout(),
    siteUrl: getSiteUrl(),
  };
}
