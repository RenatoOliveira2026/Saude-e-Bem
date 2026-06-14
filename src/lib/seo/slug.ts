import { notFound } from "next/navigation";
import {
  DYNAMIC_SLUG_PATH_PATTERNS,
  KNOWN_ROOT_SEGMENTS,
} from "./public-routes";

/** Slugs públicos: minúsculas, números e hífens (padrão editorial PT-BR). */
export const PUBLIC_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidPublicSlug(slug: string | null | undefined): slug is string {
  if (!slug || slug.length > 120) return false;
  return PUBLIC_SLUG_PATTERN.test(slug);
}

export function filterValidPublicSlugs(slugs: string[]): string[] {
  return slugs.filter(isValidPublicSlug);
}

/** Rejeita slugs malformados antes de consultar o banco (evita soft-404 e ruído SEO). */
export function assertValidPublicSlug(slug: string): void {
  if (!isValidPublicSlug(slug)) notFound();
}

/**
 * Detecta URLs de probe/bot no nível raiz (ex.: /14egx_67914425b671een).
 * Não são geradas pelo app — padrão típico de scanner externo / bot malicioso.
 */
export function isLikelyBotProbePath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/") return false;

  const segments = normalized.split("/").filter(Boolean);
  if (segments.length !== 1) return false;

  const segment = decodeURIComponent(segments[0]).toLowerCase();
  if (KNOWN_ROOT_SEGMENTS.has(segment)) return false;

  if (segment.includes("_")) return true;

  if (
    segment.length >= 24 &&
    !segment.includes("-") &&
    /^[a-z0-9]+$/i.test(segment)
  ) {
    return true;
  }

  return false;
}

/** Extrai slug inválido em rotas dinâmicas (/blog/foo_bar, /api/affiliates/x/go). */
export function extractInvalidSlugFromPath(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";

  for (const pattern of DYNAMIC_SLUG_PATH_PATTERNS) {
    const match = normalized.match(pattern);
    const slug = match?.[1];
    if (slug && !isValidPublicSlug(decodeURIComponent(slug))) {
      return slug;
    }
  }

  return null;
}

/** Rejeição antecipada no edge — probes na raiz ou slugs malformados. */
export function shouldRejectPublicPath(pathname: string): boolean {
  return isLikelyBotProbePath(pathname) || extractInvalidSlugFromPath(pathname) !== null;
}

export function notFoundSeoHeaders(): HeadersInit {
  return {
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "public, max-age=300",
  };
}
