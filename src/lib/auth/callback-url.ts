import { getSiteUrl } from "@/lib/seo/site-url";

/** URL canônica do callback OAuth/OTP — use em signUp e resetPassword. */
export function buildAuthCallbackUrl(nextPath: string): string {
  const siteUrl = getSiteUrl();
  const next = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
  return `${siteUrl}/auth/callback?next=${encodeURIComponent(next)}`;
}
