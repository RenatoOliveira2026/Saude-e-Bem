/**
 * Estrutura preparada para funcionalidades futuras da jornada do usuário.
 * Tabelas a serem criadas em migrations futuras do Supabase.
 */
export type FutureFeature =
  | "favorites"
  | "protocols"
  | "library"
  | "ai-assistant";

export interface FutureFeatureMeta {
  id: FutureFeature;
  title: string;
  description: string;
  tableName: string;
}

export const futureFeatures: FutureFeatureMeta[] = [
  {
    id: "favorites",
    title: "Favoritos",
    description: "Protocolos, artigos e materiais salvos pelo usuário.",
    tableName: "favorites",
  },
  {
    id: "protocols",
    title: "Protocolos em andamento",
    description: "Progresso e histórico de protocolos do usuário.",
    tableName: "user_protocols",
  },
  {
    id: "library",
    title: "Biblioteca pessoal",
    description: "Materiais baixados e organizados pelo usuário.",
    tableName: "user_library",
  },
  {
    id: "ai-assistant",
    title: "IA Saúde & Bem",
    description: "Conversas e recomendações personalizadas.",
    tableName: "ai_conversations",
  },
];
