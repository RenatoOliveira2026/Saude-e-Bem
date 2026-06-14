import type { BlogCategory, ContentCategory } from "@/lib/data/types";
import { blogCategoryLabels, categoryLabels } from "@/lib/data/types";

/** Taxonomia oficial — Fase 5.3 Central de Recomendações */
export const AFFILIATE_CATEGORY_OPTIONS = [
  { value: "suplementos", label: "Suplementos" },
  { value: "livros", label: "Livros" },
  { value: "saude-mental", label: "Saúde Mental" },
  { value: "exercicios", label: "Exercícios" },
  { value: "sono", label: "Sono" },
  { value: "alimentacao-saudavel", label: "Alimentação Saudável" },
  { value: "equipamentos-saude", label: "Equipamentos de Saúde" },
  { value: "bem-estar", label: "Bem-estar" },
] as const;

export type AffiliateCategorySlug = (typeof AFFILIATE_CATEGORY_OPTIONS)[number]["value"];

/** Mapeamento de categorias legadas (migrations anteriores) */
export const LEGACY_AFFILIATE_CATEGORY_MAP: Record<string, AffiliateCategorySlug> = {
  mente: "saude-mental",
  "saúde-mental": "saude-mental",
  alimentacao: "alimentacao-saudavel",
  nutricao: "alimentacao-saudavel",
  suplemento: "suplementos",
  livro: "livros",
  exercicio: "exercicios",
  movimento: "exercicios",
  equipamento: "equipamentos-saude",
  dispositivo: "equipamentos-saude",
  energia: "bem-estar",
  intestinal: "bem-estar",
  detox: "bem-estar",
  longevidade: "bem-estar",
  menopausa: "bem-estar",
  wellness: "bem-estar",
};

export function normalizeAffiliateCategory(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "-")
    .trim();
}

/** Resolve slug canônico (inclui legado) */
export function resolveAffiliateCategory(value: string): string {
  const normalized = normalizeAffiliateCategory(value);
  const legacy = LEGACY_AFFILIATE_CATEGORY_MAP[normalized];
  if (legacy) return legacy;

  const match = AFFILIATE_CATEGORY_OPTIONS.find(
    (opt) => opt.value === normalized || normalizeAffiliateCategory(opt.label) === normalized,
  );
  return match?.value ?? normalized;
}

export function getAffiliateCategoryLabel(value: string): string {
  const resolved = resolveAffiliateCategory(value);
  const match = AFFILIATE_CATEGORY_OPTIONS.find((opt) => opt.value === resolved);
  return match?.label ?? value;
}

const BLOG_CATEGORY_ALIASES: Partial<Record<BlogCategory, string[]>> = {
  hidratacao: ["hidratacao", "alimentacao-saudavel", "agua"],
  sono: ["sono"],
  emagrecimento: ["emagrecimento", "alimentacao-saudavel", "metabolismo", "exercicios"],
  "saude-cardiovascular": ["saude-cardiovascular", "cardiovascular", "coracao", "equipamentos-saude"],
  longevidade: ["longevidade", "bem-estar", "suplementos"],
};

/** Chaves normalizadas para comparar afiliado com artigo ou protocolo */
export function getContentCategoryMatchKeys(
  category: string,
  categoryLabel: string,
  kind: "blog" | "protocol",
): Set<string> {
  const keys = new Set<string>();
  const add = (v: string | undefined) => {
    if (v) keys.add(resolveAffiliateCategory(v));
  };

  add(category);
  add(categoryLabel);
  add(resolveAffiliateCategory(category));

  if (kind === "blog") {
    const aliases = BLOG_CATEGORY_ALIASES[category as BlogCategory];
    aliases?.forEach(add);
    const blogLabel = blogCategoryLabels[category as BlogCategory];
    add(blogLabel);
  } else {
    const protocolLabel = categoryLabels[category as ContentCategory];
    add(protocolLabel);
  }

  for (const opt of AFFILIATE_CATEGORY_OPTIONS) {
    if (keys.has(opt.value)) {
      add(opt.label);
    }
    if (keys.has(normalizeAffiliateCategory(opt.label))) {
      add(opt.value);
    }
  }

  return keys;
}

export function affiliateMatchesContentCategory(
  affiliateCategory: string,
  contentCategory: string,
  contentCategoryLabel: string,
  kind: "blog" | "protocol",
): boolean {
  const affiliateKey = resolveAffiliateCategory(affiliateCategory);
  const matchKeys = getContentCategoryMatchKeys(
    contentCategory,
    contentCategoryLabel,
    kind,
  );
  return matchKeys.has(affiliateKey);
}
