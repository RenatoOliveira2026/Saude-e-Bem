/** Taxonomia oficial do blog — Fase 5.0 */
export const BLOG_CATEGORY_OPTIONS = [
  { id: "hidratacao", label: "Hidratação" },
  { id: "sono", label: "Sono" },
  { id: "emagrecimento", label: "Emagrecimento" },
  { id: "saude-cardiovascular", label: "Saúde Cardiovascular" },
  { id: "longevidade", label: "Longevidade" },
] as const;

export type ContentEngineBlogCategoryId =
  (typeof BLOG_CATEGORY_OPTIONS)[number]["id"];

/** Biblioteca inteligente — camadas de acesso */
export const LIBRARY_TIER_OPTIONS = [
  { id: "free", label: "Gratuito" },
  { id: "premium", label: "Premium" },
] as const;

export type LibraryTierId = (typeof LIBRARY_TIER_OPTIONS)[number]["id"];

/** Marketplace — tipos de produto */
export const MARKETPLACE_FULFILLMENT_OPTIONS = [
  { id: "digital", label: "Produto digital" },
  { id: "affiliate", label: "Produto afiliado" },
  { id: "own", label: "Produto próprio" },
  { id: "subscription", label: "Assinatura" },
] as const;

export type ContentEngineMarketplaceFulfillment =
  (typeof MARKETPLACE_FULFILLMENT_OPTIONS)[number]["id"];

export const MARKETPLACE_PRODUCT_TYPE_OPTIONS = [
  { id: "ebook", label: "E-book" },
  { id: "protocolo", label: "Protocolo" },
  { id: "suplemento", label: "Suplemento" },
  { id: "curso", label: "Curso" },
  { id: "dispositivo", label: "Dispositivo" },
  { id: "servico", label: "Serviço" },
  { id: "kit", label: "Kit" },
] as const;
