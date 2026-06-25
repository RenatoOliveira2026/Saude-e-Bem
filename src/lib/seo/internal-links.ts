import type { IntelligentContentType } from "@/lib/content/intelligence";
import {
  CONTENT_INTELLIGENCE_REGISTRY,
  contentIntelligenceKey,
  getContentIntelligence,
} from "@/lib/content/intelligence";
import { routes } from "@/lib/routes";

export interface InternalLinkItem {
  title: string;
  href: string;
  type: IntelligentContentType;
  slug: string;
}

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

/** Links internos automáticos a partir do registry de inteligência (Fase 9.5). */
export function getRelatedInternalLinks(
  type: IntelligentContentType,
  slug: string,
  limit = 4,
): InternalLinkItem[] {
  const intel = getContentIntelligence(type, slug);
  if (!intel?.related?.length) return [];

  return intel.related.slice(0, limit).map((rel) => ({
    title: rel.label ?? rel.slug,
    href: resolveHref(rel.type, rel.slug),
    type: rel.type,
    slug: rel.slug,
  }));
}

/** Links por objetivo compartilhado — fallback quando não há related explícito */
export function getLinksByObjective(
  objective: string,
  excludeSlug: string,
  limit = 4,
): InternalLinkItem[] {
  const items: InternalLinkItem[] = [];

  for (const [key, intel] of Object.entries(CONTENT_INTELLIGENCE_REGISTRY)) {
    if (intel.primaryObjective !== objective) continue;
    const [type, slug] = key.split(":") as [IntelligentContentType, string];
    if (slug === excludeSlug) continue;
    items.push({
      title: slug.replace(/-/g, " "),
      href: resolveHref(type, slug),
      type,
      slug,
    });
    if (items.length >= limit) break;
  }

  return items;
}

export function getInternalLinksForContent(
  type: IntelligentContentType,
  slug: string,
  objective?: string,
): InternalLinkItem[] {
  const related = getRelatedInternalLinks(type, slug);
  if (related.length > 0) return related;
  if (objective) return getLinksByObjective(objective, slug);
  return [];
}
