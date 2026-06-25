import type { ContentLevel } from "@/lib/data/types";
import type { IconName } from "@/components/icons";

/** Tipos de conteúdo rastreáveis nas trilhas e recomendações (Fase 9.4 / prep IA). */
export type IntelligentContentType =
  | "article"
  | "protocol"
  | "library"
  | "tool"
  | "checklist";

export type ContentAudience = "geral" | "feminino" | "masculino" | "50+" | "iniciantes";

export type ContentObjective =
  | "sono"
  | "ansiedade"
  | "alimentacao"
  | "emagrecimento"
  | "saude-feminina"
  | "saude-masculina"
  | "longevidade"
  | "energia"
  | "bem-estar";

export interface ContentRelation {
  type: IntelligentContentType;
  slug: string;
  label?: string;
}

/** Metadados para recomendações futuras (Fase 10.x) — sem IA nesta fase. */
export interface ContentIntelligence {
  keywords: string[];
  primaryObjective: ContentObjective;
  category: string;
  level: ContentLevel;
  audience: ContentAudience[];
  estimatedMinutes?: number;
  related: ContentRelation[];
  isNew?: boolean;
}

export interface ContentIntelligenceKey {
  type: IntelligentContentType;
  slug: string;
}

export function contentIntelligenceKey(
  type: IntelligentContentType,
  slug: string,
): string {
  return `${type}:${slug}`;
}

/** Registro estático — extensível sem migrations. */
export const CONTENT_INTELLIGENCE_REGISTRY: Record<string, ContentIntelligence> = {
  // —— Artigos ——
  [contentIntelligenceKey("article", "como-melhorar-qualidade-do-sono")]: {
    keywords: ["sono", "higiene do sono", "descanso"],
    primaryObjective: "sono",
    category: "sono",
    level: "Iniciante",
    audience: ["geral"],
    estimatedMinutes: 8,
    related: [
      { type: "protocol", slug: "sono-reparador" },
      { type: "library", slug: "sono-reparador-ebook" },
    ],
  },
  [contentIntelligenceKey("article", "dormir-melhor-sem-medicamentos")]: {
    keywords: ["sono natural", "insônia leve", "rotina noturna"],
    primaryObjective: "sono",
    category: "sono",
    level: "Iniciante",
    audience: ["geral"],
    estimatedMinutes: 10,
    related: [{ type: "protocol", slug: "sono-restaurador" }],
    isNew: true,
  },
  [contentIntelligenceKey("article", "controle-ansiedade")]: {
    keywords: ["ansiedade", "respiração", "bem-estar mental"],
    primaryObjective: "ansiedade",
    category: "ansiedade",
    level: "Iniciante",
    audience: ["geral"],
    estimatedMinutes: 9,
    related: [
      { type: "protocol", slug: "reducao-estresse" },
      { type: "article", slug: "tecnicas-respiracao" },
    ],
  },
  [contentIntelligenceKey("article", "tecnicas-respiracao")]: {
    keywords: ["respiração", "calma", "nervo vago"],
    primaryObjective: "ansiedade",
    category: "controle-estresse",
    level: "Iniciante",
    audience: ["geral"],
    estimatedMinutes: 6,
    related: [{ type: "protocol", slug: "reducao-estresse" }],
  },
  [contentIntelligenceKey("article", "alimentacao-saudavel-iniciantes")]: {
    keywords: ["nutrição", "alimentação", "hábitos"],
    primaryObjective: "alimentacao",
    category: "alimentacao-saudavel",
    level: "Iniciante",
    audience: ["geral", "iniciantes"],
    estimatedMinutes: 12,
    related: [{ type: "protocol", slug: "habitos-saudaveis-30-dias" }],
  },
  [contentIntelligenceKey("article", "emagrecimento-sustentavel")]: {
    keywords: ["emagrecimento", "metabolismo", "hábitos"],
    primaryObjective: "emagrecimento",
    category: "emagrecimento",
    level: "Intermediário",
    audience: ["geral"],
    estimatedMinutes: 11,
    related: [
      { type: "protocol", slug: "emagrecimento-saudavel" },
      { type: "library", slug: "guia-emagrecimento-metabolico" },
    ],
  },
  [contentIntelligenceKey("article", "longevidade-qualidade-vida")]: {
    keywords: ["longevidade", "envelhecimento", "prevenção"],
    primaryObjective: "longevidade",
    category: "longevidade",
    level: "Intermediário",
    audience: ["geral", "50+"],
    estimatedMinutes: 14,
    related: [
      { type: "protocol", slug: "longevidade-premium" },
      { type: "library", slug: "manual-longevidade" },
    ],
  },
  [contentIntelligenceKey("article", "como-aumentar-energia-naturalmente")]: {
    keywords: ["energia", "vitalidade", "circadiano"],
    primaryObjective: "energia",
    category: "energia",
    level: "Iniciante",
    audience: ["geral", "masculino"],
    estimatedMinutes: 9,
    related: [{ type: "protocol", slug: "energia-diaria-premium" }],
  },
  // —— Protocolos premium ——
  [contentIntelligenceKey("protocol", "sono-restaurador")]: {
    keywords: ["sono profundo", "circadiano", "21 dias"],
    primaryObjective: "sono",
    category: "sono",
    level: "Intermediário",
    audience: ["geral"],
    estimatedMinutes: 21 * 15,
    related: [{ type: "library", slug: "sono-restaurador" }],
    isNew: true,
  },
  [contentIntelligenceKey("protocol", "reducao-estresse")]: {
    keywords: ["estresse", "ansiedade", "sistema nervoso"],
    primaryObjective: "ansiedade",
    category: "controle-estresse",
    level: "Intermediário",
    audience: ["geral"],
    estimatedMinutes: 14 * 12,
    related: [{ type: "article", slug: "controle-ansiedade" }],
  },
  [contentIntelligenceKey("protocol", "habitos-saudaveis-30-dias")]: {
    keywords: ["hábitos", "rotina", "30 dias"],
    primaryObjective: "alimentacao",
    category: "bem-estar-geral",
    level: "Iniciante",
    audience: ["geral", "iniciantes"],
    estimatedMinutes: 30 * 10,
    related: [{ type: "checklist", slug: "checklist-habitos" }],
  },
  [contentIntelligenceKey("protocol", "emagrecimento-saudavel")]: {
    keywords: ["perda de gordura", "metabolismo", "28 dias"],
    primaryObjective: "emagrecimento",
    category: "alimentacao-saudavel",
    level: "Intermediário",
    audience: ["geral"],
    estimatedMinutes: 28 * 15,
    related: [{ type: "library", slug: "guia-emagrecimento-metabolico" }],
  },
  [contentIntelligenceKey("protocol", "menopausa-saudavel")]: {
    keywords: ["menopausa", "hormônios", "mulher"],
    primaryObjective: "saude-feminina",
    category: "saude-feminina",
    level: "Intermediário",
    audience: ["feminino", "50+"],
    estimatedMinutes: 21 * 12,
    related: [],
  },
  [contentIntelligenceKey("protocol", "energia-diaria-premium")]: {
    keywords: ["energia", "foco", "manhã"],
    primaryObjective: "energia",
    category: "energia",
    level: "Intermediário",
    audience: ["geral", "masculino"],
    estimatedMinutes: 14 * 10,
    related: [{ type: "article", slug: "habitos-matinais-saudaveis" }],
  },
  [contentIntelligenceKey("protocol", "longevidade-premium")]: {
    keywords: ["longevidade", "pilares", "90 dias"],
    primaryObjective: "longevidade",
    category: "longevidade",
    level: "Avançado",
    audience: ["geral", "50+"],
    estimatedMinutes: 90 * 12,
    related: [{ type: "library", slug: "manual-longevidade" }],
  },
  [contentIntelligenceKey("protocol", "foco-produtividade")]: {
    keywords: ["foco", "produtividade", "mente"],
    primaryObjective: "energia",
    category: "mente",
    level: "Intermediário",
    audience: ["masculino", "geral"],
    estimatedMinutes: 14 * 10,
    related: [],
  },
  // —— Biblioteca ——
  [contentIntelligenceKey("library", "sono-reparador-ebook")]: {
    keywords: ["e-book", "sono", "guia"],
    primaryObjective: "sono",
    category: "sono",
    level: "Iniciante",
    audience: ["geral"],
    estimatedMinutes: 12,
    related: [{ type: "protocol", slug: "sono-reparador" }],
  },
  [contentIntelligenceKey("library", "guia-emagrecimento-metabolico")]: {
    keywords: ["emagrecimento", "metabolismo", "premium"],
    primaryObjective: "emagrecimento",
    category: "emagrecimento",
    level: "Intermediário",
    audience: ["geral"],
    estimatedMinutes: 35,
    related: [{ type: "protocol", slug: "emagrecimento-saudavel" }],
    isNew: true,
  },
  [contentIntelligenceKey("library", "manual-longevidade")]: {
    keywords: ["longevidade", "guia", "premium"],
    primaryObjective: "longevidade",
    category: "longevidade",
    level: "Avançado",
    audience: ["50+", "geral"],
    estimatedMinutes: 40,
    related: [{ type: "protocol", slug: "longevidade-premium" }],
  },
  [contentIntelligenceKey("library", "sono-restaurador")]: {
    keywords: ["protocolo premium", "sono", "21 dias"],
    primaryObjective: "sono",
    category: "sono",
    level: "Intermediário",
    audience: ["geral"],
    estimatedMinutes: 21,
    related: [{ type: "protocol", slug: "sono-restaurador" }],
    isNew: true,
  },
};

export function getContentIntelligence(
  type: IntelligentContentType,
  slug: string,
): ContentIntelligence | undefined {
  return CONTENT_INTELLIGENCE_REGISTRY[contentIntelligenceKey(type, slug)];
}

export function getObjectiveLabel(objective: ContentObjective): string {
  const labels: Record<ContentObjective, string> = {
    sono: "Dormir melhor",
    ansiedade: "Redução da ansiedade",
    alimentacao: "Alimentação saudável",
    emagrecimento: "Emagrecimento inteligente",
    "saude-feminina": "Saúde feminina",
    "saude-masculina": "Saúde masculina",
    longevidade: "Longevidade",
    energia: "Energia e disposição",
    "bem-estar": "Bem-estar geral",
  };
  return labels[objective];
}

export const TRAIL_OBJECTIVE_ICONS: Record<ContentObjective, IconName> = {
  sono: "moon",
  ansiedade: "heart-leaf",
  alimentacao: "leaf",
  emagrecimento: "scale",
  "saude-feminina": "heart-leaf",
  "saude-masculina": "bolt",
  longevidade: "sparkle",
  energia: "bolt",
  "bem-estar": "star",
};
