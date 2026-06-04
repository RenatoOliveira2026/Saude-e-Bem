import { getProtocolLibraryItems } from "@/lib/protocol-library/services/library.service";
import type { ProtocolLibraryItem } from "@/lib/protocol-library/types";
import { routes } from "@/lib/routes";
import type { SavableToolSlug } from "./constants";
import type { HealthRecommendation, UserToolResultRecord } from "./types";

interface CategoryHint {
  categorySlug: string;
  reason: string;
}

function latestResultFor(
  records: UserToolResultRecord[],
  slug: SavableToolSlug,
): UserToolResultRecord | null {
  return records.find((r) => r.toolSlug === slug) ?? null;
}

function collectCategoryHints(records: UserToolResultRecord[]): CategoryHint[] {
  const hints: CategoryHint[] = [];
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
              reason: `Alinhado ao seu perfil${label ? ` (${label})` : ""} no Quiz Saúde & Bem`,
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
        reason: "Com base no seu último IMC — foco em composição corporal",
      });
      hints.push({
        categorySlug: "exercicios",
        reason: "Movimento regular apoia metabolismo e composição corporal",
      });
    } else if (category === "underweight") {
      hints.push({
        categorySlug: "alimentacao-saudavel",
        reason: "Nutrição adequada para apoiar peso e energia",
      });
    }
  }

  const protein = latestResultFor(records, "proteina-diaria");
  if (protein) {
    hints.push({
      categorySlug: "alimentacao-saudavel",
      reason: "Meta proteica registrada — combine com hábitos alimentares",
    });
  }

  const water = latestResultFor(records, "consumo-agua");
  if (water) {
    hints.push({
      categorySlug: "bem-estar-geral",
      reason: "Hidratação personalizada — hábitos integrados no dia a dia",
    });
  }

  const basal = latestResultFor(records, "metabolismo-basal");
  if (basal) {
    hints.push({
      categorySlug: "exercicios",
      reason: "Gasto energético estimado — atividade física estruturada",
    });
  }

  if (hints.length === 0) {
    hints.push({
      categorySlug: "bem-estar-geral",
      reason: "Explore protocolos gratuitos para iniciar sua jornada",
    });
  }

  return hints;
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

export async function buildHealthRecommendations(
  records: UserToolResultRecord[],
): Promise<HealthRecommendation[]> {
  const pool = await getProtocolLibraryItems();
  const hints = collectCategoryHints(records);
  const usedSlugs = new Set<string>();
  const recommendations: HealthRecommendation[] = [];

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
    });
  }

  if (recommendations.length === 0) {
    const fallback = pool.filter((p) => !p.isPremium).slice(0, 3);
    for (const protocol of fallback) {
      recommendations.push({
        protocolSlug: protocol.slug,
        protocolTitle: protocol.title,
        categoryLabel: protocol.categoryLabel,
        reason: "Protocolo gratuito sugerido para começar",
        href: routes.protocolo(protocol.slug),
        isPremium: protocol.isPremium,
      });
    }
  }

  return recommendations;
}
