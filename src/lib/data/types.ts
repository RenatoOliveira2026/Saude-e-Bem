import type { IconName } from "@/components/icons";
import type { ContentBlock } from "@/lib/admin/cms/content-blocks";
import type { BaseEntity } from "./base";

export type { ContentBlock };

export type ContentCategory =
  | "sono"
  | "energia"
  | "intestinal"
  | "detox"
  | "longevidade"
  | "menopausa"
  | "nutricao"
  | "mente";

export type BlogCategory =
  | "longevidade"
  | "energia"
  | "sono"
  | "saude-intestinal"
  | "alimentacao"
  | "saude-mental";

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
};

export const blogCategoryLabels: Record<BlogCategory, string> = {
  longevidade: "Longevidade",
  energia: "Energia",
  sono: "Sono",
  "saude-intestinal": "Saúde Intestinal",
  alimentacao: "Alimentação",
  "saude-mental": "Saúde Mental",
};
