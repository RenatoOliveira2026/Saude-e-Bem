import type { BlogCategory } from "@/lib/data/types";
import { DEFAULT_OG_IMAGE } from "@/lib/seo/site-url";

/** Capas ilustrativas por categoria — Fase 5.1 */
export const BLOG_CATEGORY_COVER_IMAGES: Record<BlogCategory, string> = {
  hidratacao: "/blog/categories/hidratacao.svg",
  emagrecimento: "/blog/categories/emagrecimento.svg",
  "saude-cardiovascular": "/blog/categories/saude-cardiovascular.svg",
  sono: "/blog/categories/sono.svg",
  longevidade: "/blog/categories/longevidade.svg",
};

const GENERIC_COVER_PATHS = new Set([
  DEFAULT_OG_IMAGE,
  "/logo-saude-bem.png",
  "/logo-saude-bem.png.png",
]);

function normalizeCoverPath(url: string): string {
  return url.trim().split("?")[0] ?? url;
}

/** Indica capa genérica (logo padrão ou vazia) — não é upload customizado. */
export function isGenericArticleCover(url?: string | null): boolean {
  if (!url?.trim()) return true;
  return GENERIC_COVER_PATHS.has(normalizeCoverPath(url));
}

/**
 * Resolve a imagem exibida nos cards e metadados do blog.
 * Prioridade: cover_image_url custom → og_image_url custom → categoria → logo.
 */
export function resolveArticleCoverUrl(input: {
  coverImageUrl?: string | null;
  ogImageUrl?: string | null;
  category: BlogCategory;
}): string {
  if (!isGenericArticleCover(input.coverImageUrl)) {
    return input.coverImageUrl!;
  }
  if (!isGenericArticleCover(input.ogImageUrl)) {
    return input.ogImageUrl!;
  }
  return BLOG_CATEGORY_COVER_IMAGES[input.category] ?? DEFAULT_OG_IMAGE;
}
