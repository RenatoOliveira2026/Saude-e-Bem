import type { SavableToolSlug } from "@/lib/health-profile/constants";

/** Sinais das ferramentas avaliados pelo motor (Fase 4.5). */
export type ProtocolSignal =
  | "bmi"
  | "water"
  | "protein"
  | "metabolism"
  | "cardiometabolic"
  | "quiz";

export type IntelligentProtocolId =
  | "emagrecimento-inteligente"
  | "saude-cardiovascular"
  | "hidratacao-inteligente"
  | "longevidade-ativa"
  | "preservacao-massa-muscular"
  | "habitos-saudaveis-essenciais";

/** Protocolo do catálogo inteligente (entidade local — sem alteração de banco). */
export interface Protocol {
  id: IntelligentProtocolId;
  slug: IntelligentProtocolId;
  title: string;
  description: string;
  categoryLabel: string;
  duration: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  /** Slug do protocolo publicado na plataforma para deep link */
  platformSlug: string;
  focusSignals: ProtocolSignal[];
  isPremium: boolean;
}

export interface ProtocolMatchScore {
  protocol: Protocol;
  score: number;
  reason: string;
}

export interface RecommendedIntelligentProtocol {
  protocolSlug: string;
  protocolTitle: string;
  categoryLabel: string;
  description: string;
  reason: string;
  href: string;
  isPremium: boolean;
  priority: number;
  matchScore: number;
  relatedSignals: ProtocolSignal[];
}

export type ToolResultContext = {
  toolSlug: SavableToolSlug;
  resultJson: Record<string, unknown>;
};
