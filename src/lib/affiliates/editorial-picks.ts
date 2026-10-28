import type { BlogCategory } from "@/lib/data/types";

/**
 * Seleção editorial de produtos afiliados por protocolo e por tema de artigo.
 *
 * Os slugs são os de affiliate_links (painel → Afiliados). A ordem é a de
 * exibição. Produto inativo, removido ou sem link real é ignorado, e a seção
 * completa as vagas com a combinação automática por categoria.
 */

const SONO = ["livro-por-que-nos-dormimos", "mascara-de-dormir-3d-blackout", "livro-sono-nick-littlehales"];
const ENERGIA = ["xiaomi-smart-band-9-active", "garrafa-agua-2-litros-marcador", "livro-habitos-atomicos"];
const INTESTINAL = ["livro-panelinha-rita-lobo", "balanca-cozinha-sf400", "garrafa-agua-2-litros-marcador"];
const LONGEVIDADE = ["livro-outlive-peter-attia", "par-caneleiras-2kg", "monitor-pressao-omron-hem-7122"];

export const PROTOCOL_AFFILIATE_PICKS: Record<string, string[]> = {
  "sono-restaurador": SONO,
  "sono-reparador": SONO,
  "energia-diaria": ENERGIA,
  "energia-diaria-premium": ENERGIA,
  "reducao-estresse": ["livro-respire-james-nestor", "mascara-de-dormir-3d-blackout", "tapete-yoga-arimo-6mm"],
  "saude-intestinal": INTESTINAL,
  "saude-intestinal-premium": INTESTINAL,
  "habitos-saudaveis-30-dias": ["livro-habitos-atomicos", "garrafa-agua-2-litros-marcador", "xiaomi-smart-band-9-active"],
  "hidratacao-inteligente": ["garrafa-agua-2-litros-marcador", "xiaomi-smart-band-9-active", "livro-habitos-atomicos"],
  "detox-natural": ["livro-panelinha-rita-lobo", "garrafa-agua-2-litros-marcador", "balanca-cozinha-sf400"],
  "mobilidade-alongamento": ["tapete-yoga-arimo-6mm", "rolo-liberacao-miofascial-lorben", "kit-mini-band-odin-fit"],
  "foco-produtividade": ["livro-habitos-atomicos", "livro-respire-james-nestor", "xiaomi-smart-band-9-active"],
  "emagrecimento-saudavel": ["balanca-bioimpedancia-relaxmedic", "fita-metrica-corporal", "livro-panelinha-rita-lobo"],
  "longevidade-saudavel": LONGEVIDADE,
  "longevidade-premium": LONGEVIDADE,
  "menopausa-saudavel": ["livro-outlive-peter-attia", "par-caneleiras-2kg", "livro-por-que-nos-dormimos"],
};

export const BLOG_CATEGORY_AFFILIATE_PICKS: Partial<Record<BlogCategory, string[]>> = {
  hidratacao: ["garrafa-agua-2-litros-marcador", "xiaomi-smart-band-9-active", "livro-habitos-atomicos"],
  sono: SONO,
  emagrecimento: ["balanca-bioimpedancia-relaxmedic", "fita-metrica-corporal", "livro-panelinha-rita-lobo"],
  "saude-cardiovascular": ["monitor-pressao-omron-hem-7122", "fita-metrica-corporal", "porta-comprimidos-semanal"],
  longevidade: ["livro-outlive-peter-attia", "par-caneleiras-2kg", "porta-comprimidos-semanal"],
};
