import type {
  AlsoBenefitSuggestion,
  IntelligentJourneyPanel,
  IntelligentRecommendation,
  IntelligentUserProfile,
} from "./types";

/** Contrato para IA conversacional futura (Fase 10.x+) — somente leitura. */
export interface RecommendationEngineQuery {
  userId: string;
  goalKey?: string | null;
  isPremium?: boolean;
  limit?: number;
  /** Contexto livre para futura integração LLM */
  naturalLanguageContext?: string;
}

export interface RecommendationEngineContext {
  profile: IntelligentUserProfile;
  recommendations: IntelligentRecommendation[];
  journeyPanel: IntelligentJourneyPanel;
  alsoBenefit: AlsoBenefitSuggestion[];
}

export interface RecommendationEngineService {
  getContext(query: RecommendationEngineQuery): Promise<RecommendationEngineContext>;
  explainRecommendation(recommendationId: string): Promise<string>;
}

/**
 * Implementação stub — delega ao motor TypeScript.
 * Uma futura IA conversacional injetará este serviço via DI.
 */
export function createRecommendationEngineBridge(
  loaders: {
    loadContext: (query: RecommendationEngineQuery) => Promise<RecommendationEngineContext>;
  },
): RecommendationEngineService {
  return {
    async getContext(query) {
      return loaders.loadContext(query);
    },
    async explainRecommendation(recommendationId) {
      return `Recomendação ${recommendationId} baseada em objetivo, histórico e metadados do registry.`;
    },
  };
}
