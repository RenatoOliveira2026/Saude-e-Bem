export const SITE_NAME = "Saúde & Bem";

const DEFAULT_SITE_URL = "http://localhost:3001";

/** Garante protocolo absoluto (evita ERR_INVALID_URL no metadataBase / new URL). */
export function normalizeSiteUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return DEFAULT_SITE_URL;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    DEFAULT_SITE_URL;

  return normalizeSiteUrl(raw);
}

/** URL absoluta para metadataBase — sempre com protocolo válido. */
export function getMetadataBaseUrl(): URL {
  return new URL(getSiteUrl());
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export const DEFAULT_OG_IMAGE = "/logo-saude-bem.png";
