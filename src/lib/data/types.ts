import type { IconName } from "@/components/icons";
import type { ContentBlock } from "@/lib/admin/cms/content-blocks";
import type { BaseEntity } from "./base";

export type { ContentBlock };

/** Categorias legadas (seed) + taxonomia Fase 4.2 */
export type ContentCategory =
  | "sono"
  | "energia"
  | "intestinal"
  | "detox"
  | "longevidade"
  | "menopausa"
  | "nutricao"
  | "mente"
  | "saude-mental"
  | "ansiedade"
  | "alimentacao-saudavel"
  | "exercicios"
  | "controle-estresse"
  | "saude-feminina"
  | "saude-masculina"
  | "saude-idoso"
  | "bem-estar-geral";

export type BlogCategory =
  | "hidratacao"
  | "sono"
  | "emagrecimento"
  | "saude-cardiovascular"
  | "longevidade";

export type ContentLevel = "Iniciante" | "Intermediário" | "Avançado";

export interface ProtocolStep {
  title: string;
  description: string;
}

export interface ContentSeoFields {
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  ogImageUrl?: string | null;
}

export interface Protocol extends BaseEntity, ContentSeoFields {
  title: string;
  description: string;
  objective: string;
  longDescription: string;
  coverImageUrl?: string;
  category: ContentCategory;
  categoryLabel: string;
  duration: string;
  level: ContentLevel;
  benefits: string[];
  steps: ProtocolStep[];
  isPremium: boolean;
  featured?: boolean;
  tag?: string;
  participants: number;
  contentBlocks?: ContentBlock[];
}

export interface Tool extends BaseEntity {
  title: string;
  description: string;
  longDescription: string;
  category: "avaliacao" | "calculadora" | "monitoramento";
  categoryLabel: string;
  icon: IconName;
  duration: string;
  features: string[];
  isPremium: boolean;
  featured?: boolean;
}

export interface LibraryResource extends BaseEntity, ContentSeoFields {
  title: string;
  description: string;
  longDescription: string;
  coverImageUrl?: string;
  pdfUrl?: string;
  category: string;
  categoryLabel: string;
  icon: IconName;
  format: string;
  pages: number;
  highlights: string[];
  isPremium: boolean;
  downloads: number;
  featured?: boolean;
  contentBlocks?: ContentBlock[];
}

export interface BlogArticle extends BaseEntity, ContentSeoFields {
  title: string;
  excerpt: string;
  content: string[];
  contentBlocks: ContentBlock[];
  coverImageUrl?: string;
  category: BlogCategory;
  categoryLabel: string;
  author: string;
  authorRole: string;
  readTime: string;
  publishedAt: string;
  featured?: boolean;
  isPremium: boolean;
}

export interface ClubPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  savingsLabel?: string;
}

export interface ClubFaq {
  question: string;
  answer: string;
}

export interface ClubTestimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export const categoryLabels: Record<ContentCategory, string> = {
  sono: "Sono",
  energia: "Energia",
  intestinal: "Saúde Intestinal",
  detox: "Detox",
  longevidade: "Longevidade",
  menopausa: "Menopausa",
  nutricao: "Nutrição",
  mente: "Saúde Mental",
  "saude-mental": "Saúde Mental",
  ansiedade: "Ansiedade",
  "alimentacao-saudavel": "Alimentação Saudável",
  exercicios: "Exercícios",
  "controle-estresse": "Controle de Estresse",
  "saude-feminina": "Saúde Feminina",
  "saude-masculina": "Saúde Masculina",
  "saude-idoso": "Saúde do Idoso",
  "bem-estar-geral": "Bem-Estar Geral",
};

export const blogCategoryLabels: Record<BlogCategory, string> = {
  hidratacao: "Hidratação",
  sono: "Sono",
  emagrecimento: "Emagrecimento",
  "saude-cardiovascular": "Saúde Cardiovascular",
  longevidade: "Longevidade",
};
