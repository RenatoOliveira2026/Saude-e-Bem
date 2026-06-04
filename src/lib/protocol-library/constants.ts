import type { IconName } from "@/components/icons";

/** Categorias oficiais Fase 4.2 */
export const PROTOCOL_LIBRARY_CATEGORIES = [
  { id: "saude-mental", label: "Saúde Mental", icon: "brain" as IconName },
  { id: "ansiedade", label: "Ansiedade", icon: "heart-leaf" as IconName },
  { id: "sono", label: "Sono", icon: "moon" as IconName },
  { id: "alimentacao-saudavel", label: "Alimentação Saudável", icon: "leaf" as IconName },
  { id: "exercicios", label: "Exercícios", icon: "activity" as IconName },
  { id: "controle-estresse", label: "Controle de Estresse", icon: "vitality" as IconName },
  { id: "saude-feminina", label: "Saúde Feminina", icon: "heart-leaf" as IconName },
  { id: "saude-masculina", label: "Saúde Masculina", icon: "bolt" as IconName },
  { id: "saude-idoso", label: "Saúde do Idoso", icon: "sparkle" as IconName },
  { id: "bem-estar-geral", label: "Bem-Estar Geral", icon: "star" as IconName },
] as const;

export type ProtocolLibraryCategoryId =
  (typeof PROTOCOL_LIBRARY_CATEGORIES)[number]["id"];

export const protocolLibraryFilterCategories = [
  { id: "todos", label: "Todos" },
  ...PROTOCOL_LIBRARY_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
];

/** Mapeia slugs legados (Fase 2.x) para taxonomia 4.2 */
export const LEGACY_PROTOCOL_CATEGORY_MAP: Record<string, ProtocolLibraryCategoryId> = {
  energia: "bem-estar-geral",
  intestinal: "alimentacao-saudavel",
  detox: "bem-estar-geral",
  longevidade: "saude-idoso",
  menopausa: "saude-feminina",
  nutricao: "alimentacao-saudavel",
  mente: "saude-mental",
};

export function normalizeProtocolCategory(
  category: string,
): ProtocolLibraryCategoryId | string {
  if (PROTOCOL_LIBRARY_CATEGORIES.some((c) => c.id === category)) {
    return category;
  }
  return LEGACY_PROTOCOL_CATEGORY_MAP[category] ?? category;
}

export function getProtocolCategoryLabel(category: string, fallback?: string): string {
  const normalized = normalizeProtocolCategory(category);
  const found = PROTOCOL_LIBRARY_CATEGORIES.find((c) => c.id === normalized);
  return found?.label ?? fallback ?? category;
}

export function getProtocolCategoryIcon(category: string): IconName {
  const normalized = normalizeProtocolCategory(category);
  const found = PROTOCOL_LIBRARY_CATEGORIES.find((c) => c.id === normalized);
  return found?.icon ?? "sparkle";
}
