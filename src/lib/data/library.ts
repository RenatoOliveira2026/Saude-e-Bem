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
      "Sem milagres: o que a ciência diz sobre detox e como apoiar fígado e rins com hábitos reais.",
    longDescription:
      "Guia de 12 páginas com o que funciona e o que é mito, plano de 10 dias com uma troca por dia e receitas simples e baratas.",
    category: "Detox",
    categoryLabel: "Detox",
    icon: "leaf",
    format: "PDF",
    pages: 12,
    highlights: ["O que a ciência diz", "Plano de 10 dias", "Receitas práticas"],
    isPremium: false,
    downloads: 0,
    featured: true,
  },
  {
    id: "2",
    slug: "guia-energia-natural",
    title: "Guia Energia Natural",
    description:
      "Mais disposição no dia a dia com sono, luz, alimentação, água e movimento.",
    longDescription:
      "Guia de 14 páginas com rotina matinal, alimentos-chave, exercícios simples e plano de 14 dias, além dos sinais de cansaço que pedem consulta.",
    category: "Energia",
    categoryLabel: "Energia",
    icon: "bolt",
    format: "PDF",
    pages: 14,
    highlights: ["Rotina matinal", "Alimentos-chave", "Plano de 14 dias"],
    isPremium: false,
    downloads: 0,
  },
  {
    id: "3",
    slug: "guia-sono-saudavel",
    title: "Guia Sono Saudável",
    description:
      "Hábitos simples para dormir melhor, quarto ideal e rotina noturna passo a passo.",
    longDescription:
      "Guia de 12 páginas com checklist do quarto, rotina noturna, plano de 7 dias, diário do sono e quando procurar o médico.",
    category: "Sono",
    categoryLabel: "Sono",
    icon: "moon",
    format: "PDF",
    pages: 12,
    highlights: ["Checklist do quarto", "Rotina noturna", "Plano de 7 dias"],
    isPremium: false,
    downloads: 0,
  },
  {
    id: "4",
    slug: "guia-habitos-saudaveis",
    title: "Guia Hábitos Saudáveis",
    description:
      "Como criar hábitos que duram: começar pequeno, encaixar na rotina e manter a constância.",
    longDescription:
      "Guia de 11 páginas com os 4 princípios para formar hábitos, exemplos práticos e um painel semanal para imprimir.",
    category: "Hábitos",
    categoryLabel: "Hábitos",
    icon: "checklist",
    format: "PDF",
    pages: 11,
    highlights: ["Começar pequeno", "Encaixar na rotina", "Painel semanal"],
    isPremium: false,
    downloads: 0,
  },
  {
    id: "5",
    slug: "guia-saude-intestinal",
    title: "Guia Saúde Intestinal",
    description:
      "Fibras, água, movimento e hábitos para um intestino que funciona bem.",
    longDescription:
      "Guia de 11 páginas com alimentos ricos em fibras, um dia de cardápio exemplo, plano gradual de 21 dias e diário do intestino.",
    category: "Intestinal",
    categoryLabel: "Saúde Intestinal",
    icon: "vitality",
    format: "PDF",
    pages: 11,
    highlights: ["Fibras na prática", "Plano de 21 dias", "Diário do intestino"],
    isPremium: false,
    downloads: 0,
  },
];

export const libraryResources: LibraryResource[] = rawResources.map((r) =>
  withBase(r),
);
export const featuredResource = libraryResources.find((r) => r.featured)!;
