import {
  SAVABLE_TOOL_SLUGS,
  TOOL_SLUG_LABELS,
  type SavableToolSlug,
} from "@/lib/health-profile/constants";
import type { UserToolResultRecord } from "@/lib/health-profile/types";
import { recommendIntelligentProtocols } from "@/lib/intelligent-protocols";
import { routes } from "@/lib/routes";
import { calculateHealthScore, getUnmetCriteria } from "./health-score";
import type {
  IntelligentRecommendations,
  PriorityAction,
  RecommendedProtocol,
  RecommendedTool,
} from "./recommendation-types";

function buildProtocolRecommendations(
  records: UserToolResultRecord[],
): RecommendedProtocol[] {
  return recommendIntelligentProtocols(records).map((p) => ({
    protocolSlug: p.protocolSlug,
    protocolTitle: p.protocolTitle,
    categoryLabel: p.categoryLabel,
    description: p.description,
    reason: p.reason,
    href: p.href,
    isPremium: p.isPremium,
    priority: p.priority,
  }));
}

function buildToolRecommendations(
  records: UserToolResultRecord[],
): RecommendedTool[] {
  const usedSlugs = new Set(
    records.map((r) => r.toolSlug).filter((s): s is SavableToolSlug =>
      (SAVABLE_TOOL_SLUGS as readonly string[]).includes(s),
    ),
  );

  const score = calculateHealthScore(records);
  const tools: RecommendedTool[] = [];
  let priority = 1;

  for (const criterion of getUnmetCriteria(score)) {
    if (!criterion.toolSlug || usedSlugs.has(criterion.toolSlug)) continue;
    tools.push({
      toolSlug: criterion.toolSlug,
      toolTitle: TOOL_SLUG_LABELS[criterion.toolSlug],
      reason: criterion.detail,
      href: routes.ferramenta(criterion.toolSlug),
      priority: priority++,
    });
  }

  for (const slug of SAVABLE_TOOL_SLUGS) {
    if (tools.length >= 4) break;
    if (usedSlugs.has(slug)) continue;
    if (tools.some((t) => t.toolSlug === slug)) continue;
    tools.push({
      toolSlug: slug,
      toolTitle: TOOL_SLUG_LABELS[slug],
      reason: "Complete esta ferramenta para enriquecer seu Score Saúde & Bem.",
      href: routes.ferramenta(slug),
      priority: priority++,
    });
  }

  return tools.slice(0, 4);
}

function buildPriorities(
  records: UserToolResultRecord[],
  protocols: RecommendedProtocol[],
  tools: RecommendedTool[],
): PriorityAction[] {
  const score = calculateHealthScore(records);
  const priorities: PriorityAction[] = [];

  for (const criterion of getUnmetCriteria(score)) {
    if (!criterion.toolSlug) continue;
    priorities.push({
      id: `criterion-${criterion.id}`,
      title: `Melhorar: ${criterion.label}`,
      description: criterion.detail,
      href: routes.ferramenta(criterion.toolSlug),
      level: criterion.id === "cardiometabolic" ? "alta" : "media",
      relatedToolSlug: criterion.toolSlug,
      relatedCriterionId: criterion.id,
    });
    if (priorities.length >= 3) break;
  }

  for (const tool of tools.slice(0, 2)) {
    if (priorities.some((p) => p.relatedToolSlug === tool.toolSlug)) continue;
    priorities.push({
      id: `tool-${tool.toolSlug}`,
      title: `Usar ${tool.toolTitle}`,
      description: tool.reason,
      href: tool.href,
      level: "media",
      relatedToolSlug: tool.toolSlug,
    });
    if (priorities.length >= 4) break;
  }

  for (const protocol of protocols.slice(0, 2)) {
    priorities.push({
      id: `protocol-${protocol.protocolSlug}`,
      title: protocol.protocolTitle,
      description: protocol.reason,
      href: protocol.href,
      level: protocol.priority <= 1 ? "alta" : "baixa",
    });
    if (priorities.length >= 5) break;
  }

  if (priorities.length === 0) {
    priorities.push({
      id: "explore-tools",
      title: "Explorar ferramentas gratuitas",
      description:
        "Use as calculadoras e avaliações para gerar seu Score Saúde & Bem.",
      href: routes.ferramentas,
      level: "alta",
    });
  }

  if (score.percentage >= 80) {
    priorities.unshift({
      id: "maintain-score",
      title: "Manter seu excelente perfil",
      description:
        "Refaça as ferramentas periodicamente para acompanhar evolução.",
      href: routes.ferramentas,
      level: "baixa",
    });
  }

  return priorities.slice(0, 5);
}

export async function buildIntelligentRecommendations(
  records: UserToolResultRecord[],
): Promise<IntelligentRecommendations> {
  const healthScore = calculateHealthScore(records);
  const protocols = buildProtocolRecommendations(records);
  const tools = buildToolRecommendations(records);
  const priorities = buildPriorities(records, protocols, tools);

  return {
    healthScore,
    protocols,
    tools,
    priorities,
  };
}
