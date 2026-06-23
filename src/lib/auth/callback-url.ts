import { getSiteUrl } from "@/lib/seo/site-url";

function buildAuthUrl(path: string, nextPath: string): string {
  const siteUrl = getSiteUrl();
  const next = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
  return `${siteUrl}${path}?next=${encodeURIComponent(next)}`;
}

/** URL de confirmação de e-mail (Fase 8.5 — preferir /auth/verify). */
export function buildAuthVerifyUrl(nextPath: string): string {
  return buildAuthUrl("/auth/verify", nextPath);
}

/** @deprecated Use buildAuthVerifyUrl — mantido para links legados /auth/callback */
export function buildAuthCallbackUrl(nextPath: string): string {
  return buildAuthUrl("/auth/callback", nextPath);
}
