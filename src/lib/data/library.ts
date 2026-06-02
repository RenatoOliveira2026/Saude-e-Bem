import { withBase } from "./base";
import type { LibraryResource } from "./types";

export const libraryCategories = [
  { id: "todos", label: "Todos" },
  { id: "Detox", label: "Detox" },
  { id: "Energia", label: "Energia" },
  { id: "Sono", label: "Sono" },
  { id: "Hábitos", label: "Hábitos" },
  { id: "Intestinal", label: "Saúde Intestinal" },
] as const;

const rawResources: Omit<LibraryResource, "status" | "createdAt" | "updatedAt">[] = [
  {
    id: "1",
    slug: "guia-detox-inteligente",
    title: "Guia Detox Inteligente",
    description:
      "Desintoxicação gentil e sustentável — alimentos, hábitos e protocolos para apoiar o fígado naturalmente.",
    longDescription:
      "Guia completo de 24 páginas com plano de 10 dias, lista de alimentos detoxificantes e receitas práticas.",
    category: "Detox",
    categoryLabel: "Detox",
    icon: "leaf",
    format: "PDF",
    pages: 24,
    highlights: ["Plano de 10 dias", "Alimentos detox", "Receitas práticas"],
    isPremium: false,
    downloads: 4820,
    featured: true,
  },
  {
    id: "2",
    slug: "guia-energia-natural",
    title: "Guia Energia Natural",
    description:
      "Estratégias circadianas e nutricionais para vitalidade consistente sem depender de cafeína.",
    longDescription:
      "Manual de 20 páginas com rotina matinal, alimentos energizantes e protocolos de movimento leve.",
    category: "Energia",
    categoryLabel: "Energia",
    icon: "bolt",
    format: "PDF",
    pages: 20,
    highlights: ["Rotina matinal", "Alimentos-chave", "Protocolo de 14 dias"],
    isPremium: false,
    downloads: 3650,
  },
  {
    id: "3",
    slug: "guia-sono-saudavel",
    title: "Guia Sono Saudável",
    description:
      "Protocolos práticos para higiene do sono, ambiente ideal e rotinas noturnas reparadoras.",
    longDescription:
      "Guia de 18 páginas com checklist de ambiente, suplementação baseada em evidências e plano de 7 dias.",
    category: "Sono",
    categoryLabel: "Sono",
    icon: "moon",
    format: "PDF",
    pages: 18,
    highlights: ["Checklist do quarto", "Rotina noturna", "Plano de 7 dias"],
    isPremium: false,
    downloads: 3910,
  },
  {
    id: "4",
    slug: "guia-habitos-saudaveis",
    title: "Guia Hábitos Saudáveis",
    description:
      "Como construir e manter hábitos duradouros de saúde com base em ciência comportamental.",
    longDescription:
      "Guia de 16 páginas sobre formação de hábitos, stacking, triggers e estratégias de consistência.",
    category: "Hábitos",
    categoryLabel: "Hábitos",
    icon: "checklist",
    format: "PDF",
    pages: 16,
    highlights: ["Ciência comportamental", "Habit stacking", "Plano semanal"],
    isPremium: false,
    downloads: 2780,
  },
  {
    id: "5",
    slug: "guia-saude-intestinal",
    title: "Guia Saúde Intestinal",
    description:
      "Microbiota, alimentos prebióticos e protocolos para restaurar o equilíbrio digestivo.",
    longDescription:
      "Manual de 22 páginas sobre eixo intestino-cérebro, alimentos funcionais e plano de 21 dias.",
    category: "Intestinal",
    categoryLabel: "Saúde Intestinal",
    icon: "vitality",
    format: "PDF",
    pages: 22,
    highlights: ["Microbiota", "Alimentos prebióticos", "Plano de 21 dias"],
    isPremium: false,
    downloads: 3240,
  },
];

export const libraryResources: LibraryResource[] = rawResources.map((r) =>
  withBase(r),
);
export const featuredResource = libraryResources.find((r) => r.featured)!;
