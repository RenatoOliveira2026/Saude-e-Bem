import type { BlogCategory, ContentCategory } from "@/lib/data/types";
import { blogCategoryLabels, categoryLabels } from "@/lib/data/types";

/** Slugs usados no admin e para correspondência com conteúdo */
export const AFFILIATE_CATEGORY_OPTIONS = [
  { value: "sono", label: "Sono" },
  { value: "energia", label: "Energia" },
  { value: "intestinal", label: "Saúde Intestinal" },
  { value: "detox", label: "Detox" },
  { value: "longevidade", label: "Longevidade" },
  { value: "menopausa", label: "Menopausa" },
  { value: "nutricao", label: "Nutrição" },
  { value: "mente", label: "Saúde Mental" },
  { value: "alimentacao", label: "Alimentação" },
] as const;

export function normalizeAffiliateCategory(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "-")
    .trim();
}

const BLOG_CATEGORY_ALIASES: Partial<Record<BlogCategory, string[]>> = {
  "saude-intestinal": ["intestinal", "saude-intestinal"],
  alimentacao: ["nutricao", "alimentacao"],
  "saude-mental": ["mente", "saude-mental"],
};

/** Chaves normalizadas para comparar afiliado com artigo ou protocolo */
export function getContentCategoryMatchKeys(
  category: string,
  categoryLabel: string,
  kind: "blog" | "protocol",
): Set<string> {
  const keys = new Set<string>();
  const add = (v: string | undefined) => {
    if (v) keys.add(normalizeAffiliateCategory(v));
  };

  add(category);
  add(categoryLabel);

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
    if (keys.has(normalizeAffiliateCategory(opt.value))) {
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
  const affiliateKey = normalizeAffiliateCategory(affiliateCategory);
  const matchKeys = getContentCategoryMatchKeys(
    contentCategory,
    contentCategoryLabel,
    kind,
  );
  return matchKeys.has(affiliateKey);
}
