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

export function getMercadoPagoWebhookSecret(): string | null {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim();
  if (!secret) return null;
  return secret;
}

export function isWebhookSecretConfigured(): boolean {
  return Boolean(getMercadoPagoWebhookSecret());
}
