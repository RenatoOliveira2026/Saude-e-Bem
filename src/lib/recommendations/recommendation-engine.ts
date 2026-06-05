import {
  SAVABLE_TOOL_SLUGS,
  TOOL_SLUG_LABELS,
  type SavableToolSlug,
} from "@/lib/health-profile/constants";
import type { UserToolResultRecord } from "@/lib/health-profile/types";
import { getProtocolLibraryItems } from "@/lib/protocol-library/services/library.service";
import type { ProtocolLibraryItem } from "@/lib/protocol-library/types";
import { routes } from "@/lib/routes";
import { calculateHealthScore, getUnmetCriteria } from "./health-score";
import type {
  IntelligentRecommendations,
  PriorityAction,
  RecommendedProtocol,
  RecommendedTool,
} from "./recommendation-types";

interface CategoryHint {
  categorySlug: string;
  reason: string;
  priority: number;
}

function latestResultFor(
  records: UserToolResultRecord[],
  slug: SavableToolSlug,
): UserToolResultRecord | null {
  return records.find((r) => r.toolSlug === slug) ?? null;
}

function collectCategoryHints(records: UserToolResultRecord[]): CategoryHint[] {
  const hints: CategoryHint[] = [];
  const score = calculateHealthScore(records);

  for (const criterion of getUnmetCriteria(score)) {
    switch (criterion.id) {
      case "bmi":
        hints.push({
          categorySlug: "alimentacao-saudavel",
          reason: "Apoio nutricional alinhado ao seu IMC registrado",
          priority: 1,
        });
        hints.push({
          categorySlug: "exercicios",
          reason: "Movimento regular para composição corporal e metabolismo",
          priority: 2,
        });
        break;
      case "water":
        hints.push({
          categorySlug: "bem-estar-geral",
          reason: "Hábitos diários incluindo hidratação consistente",
          priority: 1,
        });
        break;
      case "protein":
        hints.push({
          categorySlug: "alimentacao-saudavel",
          reason: "Estruturar refeições com foco em proteína adequada",
          priority: 1,
        });
        break;
      case "metabolism":
        hints.push({
          categorySlug: "exercicios",
          reason: "Atividade física compatível com seu gasto energético",
          priority: 1,
        });
        hints.push({
          categorySlug: "alimentacao-saudavel",
          reason: "Energia e nutrientes alinhados ao seu metabolismo",
          priority: 2,
        });
        break;
      case "cardiometabolic":
        hints.push({
          categorySlug: "longevidade",
          reason: "Prevenção cardiometabólica e marcadores de saúde",
          priority: 1,
        });
        hints.push({
          categorySlug: "exercicios",
          reason: "Condicionamento cardiovascular e controle de risco",
          priority: 2,
        });
        break;
    }
  }

  const quiz = latestResultFor(records, "quiz-saude-bem");
  if (quiz) {
    const categories = quiz.resultJson.protocolCategories;
    if (Array.isArray(categories)) {
      for (const cat of categories) {
        if (cat && typeof cat === "object" && !Array.isArray(cat)) {
          const slug = (cat as { categorySlug?: string }).categorySlug;
          const label = (cat as { categoryLabel?: string }).categoryLabel;
          if (slug) {
            hints.push({
              categorySlug: slug,
              reason: `Perfil do Quiz Saúde & Bem${label ? ` (${label})` : ""}`,
              priority: 0,
            });
          }
        }
      }
    }
  }

  const bmi = latestResultFor(records, "calculadora-imc");
  if (bmi) {
    const category = bmi.resultJson.category;
    if (
      category === "overweight" ||
      category === "obese1" ||
      category === "obese2" ||
      category === "obese3"
    ) {
      hints.push({
        categorySlug: "alimentacao-saudavel",
        reason: "Com base no seu IMC — foco em composição corporal",
        priority: 1,
      });
    }
  }

  const cardio = latestResultFor(records, "risco-cardiometabolico");
  if (cardio) {
    const level = cardio.resultJson.level;
    if (level === "elevated" || level === "high") {
      hints.push({
        categorySlug: "longevidade",
        reason: "Risco cardiometabólico elevado — prevenção estruturada",
        priority: 0,
      });
    }
  }

  if (hints.length === 0) {
    hints.push({
      categorySlug: "bem-estar-geral",
      reason: "Protocolo gratuito para consolidar hábitos de saúde",
      priority: 3,
    });
  }

  return hints.sort((a, b) => a.priority - b.priority);
}

function pickProtocolsForCategory(
  pool: ProtocolLibraryItem[],
  categorySlug: string,
  usedSlugs: Set<string>,
): ProtocolLibraryItem | null {
  const matches = pool.filter(
    (p) =>
      !usedSlugs.has(p.slug) &&
      (p.normalizedCategory === categorySlug || p.category === categorySlug),
  );
  const free = matches.find((p) => !p.isPremium);
  return free ?? matches[0] ?? null;
}

async function buildProtocolRecommendations(
  records: UserToolResultRecord[],
): Promise<RecommendedProtocol[]> {
  const pool = await getProtocolLibraryItems();
  const hints = collectCategoryHints(records);
  const usedSlugs = new Set<string>();
  const recommendations: RecommendedProtocol[] = [];

  for (const hint of hints) {
    if (recommendations.length >= 4) break;
    const protocol = pickProtocolsForCategory(pool, hint.categorySlug, usedSlugs);
    if (!protocol) continue;
    usedSlugs.add(protocol.slug);
    recommendations.push({
      protocolSlug: protocol.slug,
      protocolTitle: protocol.title,
      categoryLabel: protocol.categoryLabel,
      reason: hint.reason,
      href: routes.protocolo(protocol.slug),
      isPremium: protocol.isPremium,
      priority: hint.priority,
    });
  }

  if (recommendations.length === 0) {
    const fallback = pool.filter((p) => !p.isPremium).slice(0, 3);
    for (const [index, protocol] of fallback.entries()) {
      recommendations.push({
        protocolSlug: protocol.slug,
        protocolTitle: protocol.title,
        categoryLabel: protocol.categoryLabel,
        reason: "Protocolo gratuito sugerido para começar",
        href: routes.protocolo(protocol.slug),
        isPremium: protocol.isPremium,
        priority: index + 1,
      });
    }
  }

  return recommendations;
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
  const protocols = await buildProtocolRecommendations(records);
  const tools = buildToolRecommendations(records);
  const priorities = buildPriorities(records, protocols, tools);

  return {
    healthScore,
    protocols,
    tools,
    priorities,
  };
}
