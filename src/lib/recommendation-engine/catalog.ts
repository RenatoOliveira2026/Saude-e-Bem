import type { IconName } from "@/components/icons";
import {
  contentIntelligenceKey,
  getContentIntelligence,
  getObjectiveLabel,
  TRAIL_OBJECTIVE_ICONS,
  type ContentObjective,
  type IntelligentContentType,
} from "@/lib/content/intelligence";
import type { BlogArticle, Protocol } from "@/lib/data/types";
import { getBlogArticles } from "@/lib/data/repositories/blog.repository";
import { getProtocols } from "@/lib/data/repositories/protocols.repository";
import { getLibraryResources } from "@/lib/data/repositories/library.repository";
import { getTools } from "@/lib/data/repositories/tools.repository";
import { routes } from "@/lib/routes";
import type { CatalogItem } from "./types";

const OBJECTIVE_FROM_CATEGORY: Record<string, ContentObjective> = {
  sono: "sono",
  energia: "energia",
  emagrecimento: "emagrecimento",
  longevidade: "longevidade",
  ansiedade: "ansiedade",
  "saude-mental": "ansiedade",
  "controle-estresse": "ansiedade",
  nutricao: "alimentacao",
  "alimentacao-saudavel": "alimentacao",
  intestinal: "alimentacao",
  detox: "emagrecimento",
  menopausa: "saude-feminina",
  "saude-feminina": "saude-feminina",
  "saude-masculina": "saude-masculina",
};

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

function resolveObjective(
  type: IntelligentContentType,
  slug: string,
  fallbackCategory: string,
): ContentObjective {
  const intel = getContentIntelligence(type, slug);
  if (intel) return intel.primaryObjective;
  return OBJECTIVE_FROM_CATEGORY[fallbackCategory] ?? "bem-estar";
}

function mapArticle(article: BlogArticle): CatalogItem {
  const type: IntelligentContentType = "article";
  const intel = getContentIntelligence(type, article.slug);
  return {
    key: contentIntelligenceKey(type, article.slug),
    type,
    slug: article.slug,
    title: article.title,
    description: article.excerpt,
    href: routes.artigo(article.slug),
    objective: resolveObjective(type, article.slug, article.category),
    category: article.categoryLabel,
    level: intel?.level ?? "Iniciante",
    estimatedMinutes: intel?.estimatedMinutes ?? 8,
    isPremium: article.isPremium,
    isNew: intel?.isNew ?? false,
    icon: "book",
  };
}

function mapProtocol(protocol: Protocol): CatalogItem {
  const type: IntelligentContentType = "protocol";
  const intel = getContentIntelligence(type, protocol.slug);
  return {
    key: contentIntelligenceKey(type, protocol.slug),
    type,
    slug: protocol.slug,
    title: protocol.title,
    description: protocol.description,
    href: routes.protocolo(protocol.slug),
    objective: resolveObjective(type, protocol.slug, protocol.category),
    category: protocol.categoryLabel,
    level: intel?.level ?? protocol.level,
    estimatedMinutes: intel?.estimatedMinutes ?? 21,
    isPremium: protocol.isPremium,
    isNew: intel?.isNew ?? false,
    icon: "sparkle",
  };
}

function mapLibrary(resource: Awaited<ReturnType<typeof getLibraryResources>>[number]): CatalogItem {
  const type: IntelligentContentType = "library";
  const intel = getContentIntelligence(type, resource.slug);
  return {
    key: contentIntelligenceKey(type, resource.slug),
    type,
    slug: resource.slug,
    title: resource.title,
    description: resource.description,
    href: routes.bibliotecaItem(resource.slug),
    objective: resolveObjective(type, resource.slug, resource.category),
    category: resource.category,
    level: intel?.level ?? "Iniciante",
    estimatedMinutes: intel?.estimatedMinutes ?? 15,
    isPremium: resource.isPremium,
    isNew: intel?.isNew ?? false,
    icon: "library",
  };
}

function mapTool(tool: Awaited<ReturnType<typeof getTools>>[number]): CatalogItem {
  const type: IntelligentContentType = "tool";
  const intel = getContentIntelligence(type, tool.slug);
  return {
    key: contentIntelligenceKey(type, tool.slug),
    type,
    slug: tool.slug,
    title: tool.title,
    description: tool.description,
    href: routes.ferramenta(tool.slug),
    objective: intel?.primaryObjective ?? "bem-estar",
    category: tool.categoryLabel,
    level: intel?.level ?? "Iniciante",
    estimatedMinutes: intel?.estimatedMinutes ?? 5,
    isPremium: tool.isPremium,
    isNew: intel?.isNew ?? false,
    icon: tool.icon,
  };
}

export async function loadRecommendationCatalog(): Promise<CatalogItem[]> {
  const [articles, protocols, library, tools] = await Promise.all([
    getBlogArticles(),
    getProtocols(),
    getLibraryResources(),
    getTools(),
  ]);

  return [
    ...articles.map(mapArticle),
    ...protocols.map(mapProtocol),
    ...library.map(mapLibrary),
    ...tools.map(mapTool),
  ];
}

export function getCatalogIcon(objective: ContentObjective): IconName {
  return TRAIL_OBJECTIVE_ICONS[objective] ?? "star";
}

export { getObjectiveLabel, resolveHref };
