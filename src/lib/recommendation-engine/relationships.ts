import {
  contentIntelligenceKey,
  getContentIntelligence,
  type IntelligentContentType,
} from "@/lib/content/intelligence";
import { routes } from "@/lib/routes";
import type { AlsoBenefitSuggestion, CatalogItem } from "./types";

function resolveHref(type: IntelligentContentType, slug: string): string {
  switch (type) {
    case "article":
      return routes.artigo(slug);
    case "protocol":
      return routes.protocolo(slug);
    case "library":
      return routes.bibliotecaItem(slug);
    case "tool":
      return routes.ferramenta(slug);
    case "checklist":
      return routes.checklistHabitos;
    default:
      return routes.home;
  }
}

const TYPE_LABELS: Record<IntelligentContentType, string> = {
  article: "artigo",
  protocol: "protocolo",
  library: "material da biblioteca",
  tool: "ferramenta",
  checklist: "checklist",
};

export function getAlsoBenefitSuggestions(input: {
  sourceType: IntelligentContentType;
  sourceSlug: string;
  sourceTitle: string;
  catalog: CatalogItem[];
  consumedKeys: string[];
  limit?: number;
}): AlsoBenefitSuggestion[] {
  const intel = getContentIntelligence(input.sourceType, input.sourceSlug);
  const related = intel?.related ?? [];
  const suggestions: AlsoBenefitSuggestion[] = [];

  for (const rel of related) {
    const key = contentIntelligenceKey(rel.type, rel.slug);
    if (input.consumedKeys.includes(key)) continue;

    const catalogItem = input.catalog.find(
      (c) => c.type === rel.type && c.slug === rel.slug,
    );
    const title = rel.label ?? catalogItem?.title ?? rel.slug.replace(/-/g, " ");
    const description = catalogItem?.description ?? "";

    suggestions.push({
      id: `also-${input.sourceSlug}-${rel.type}-${rel.slug}`,
      sourceType: input.sourceType,
      sourceSlug: input.sourceSlug,
      targetType: rel.type,
      targetSlug: rel.slug,
      title,
      description,
      href: resolveHref(rel.type, rel.slug),
      message: `Quem leu este ${TYPE_LABELS[input.sourceType]} também pode se beneficiar deste ${TYPE_LABELS[rel.type]}.`,
    });
  }

  if (suggestions.length >= (input.limit ?? 3)) {
    return suggestions.slice(0, input.limit ?? 3);
  }

  const sourceIntel = intel;
  if (sourceIntel) {
    for (const item of input.catalog) {
      if (item.objective !== sourceIntel.primaryObjective) continue;
      if (item.slug === input.sourceSlug && item.type === input.sourceType) continue;
      if (input.consumedKeys.includes(item.key)) continue;
      if (suggestions.some((s) => s.targetSlug === item.slug && s.targetType === item.type)) {
        continue;
      }
      suggestions.push({
        id: `also-obj-${item.key}`,
        sourceType: input.sourceType,
        sourceSlug: input.sourceSlug,
        targetType: item.type,
        targetSlug: item.slug,
        title: item.title,
        description: item.description,
        href: item.href,
        message: `Quem explorou ${input.sourceTitle} também pode se beneficiar deste ${TYPE_LABELS[item.type]}.`,
      });
      if (suggestions.length >= (input.limit ?? 3)) break;
    }
  }

  return suggestions.slice(0, input.limit ?? 3);
}

export function getAlsoBenefitFromLastConsumed(input: {
  consumedKeys: string[];
  catalog: CatalogItem[];
  limit?: number;
}): AlsoBenefitSuggestion[] {
  const lastKey = input.consumedKeys[input.consumedKeys.length - 1];
  if (!lastKey) return [];

  const [type, slug] = lastKey.split(":") as [IntelligentContentType, string];
  const catalogItem = input.catalog.find((c) => c.type === type && c.slug === slug);

  return getAlsoBenefitSuggestions({
    sourceType: type,
    sourceSlug: slug,
    sourceTitle: catalogItem?.title ?? slug,
    catalog: input.catalog,
    consumedKeys: input.consumedKeys,
    limit: input.limit,
  });
}
