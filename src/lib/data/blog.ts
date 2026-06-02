import { parseContentBlocks } from "@/lib/admin/cms/content-blocks";
import { withBase } from "./base";
import type { BlogArticle, BlogCategory } from "./types";

export const blogCategories = [
  { id: "todos", label: "Todos" },
  { id: "longevidade", label: "Longevidade" },
  { id: "energia", label: "Energia" },
  { id: "sono", label: "Sono" },
  { id: "saude-intestinal", label: "Saúde Intestinal" },
  { id: "alimentacao", label: "Alimentação" },
  { id: "saude-mental", label: "Saúde Mental" },
] as const;

const rawArticles: Omit<
  BlogArticle,
  "status" | "createdAt" | "updatedAt" | "contentBlocks"
>[] = [
  {
    id: "1",
    slug: "pilares-longevidade-2026",
    title: "Os 5 pilares da longevidade que a ciência confirma",
    excerpt:
      "Descubra os hábitos com maior evidência científica para viver mais e melhor — sem modismos ou promessas vazias.",
    content: [
      "A longevidade de qualidade nasce de hábitos consistentes com respaldo científico. Em 2026, cinco pilares se destacam na literatura.",
      "Sono reparador, nutrição anti-inflamatória, movimento regular, gestão do estresse e conexões sociais formam a base de uma vida longa e plena.",
    ],
    category: "longevidade",
    categoryLabel: "Longevidade",
    author: "Dra. Marina Alves",
    authorRole: "Medicina Preventiva",
    readTime: "8 min",
    publishedAt: "28 Mai 2026",
    featured: true,
  },
  {
    id: "2",
    slug: "energia-sem-cafeina",
    title: "Energia sustentável sem depender de cafeína",
    excerpt:
      "Estratégias circadianas e nutricionais para manter vitalidade consistente ao longo do dia.",
    content: [
      "Energia sustentável vem de ritmo circadiano alinhado, hidratação, proteína no café da manhã e exposição solar matinal.",
      "Cafeína após 14h pode comprometer sono e criar ciclo de dependência energética que mascarar fadiga crônica.",
    ],
    category: "energia",
    categoryLabel: "Energia",
    author: "Dra. Marina Alves",
    authorRole: "Medicina Preventiva",
    readTime: "6 min",
    publishedAt: "22 Mai 2026",
  },
  {
    id: "3",
    slug: "sono-imunidade-metabolismo",
    title: "Como o sono impacta imunidade e metabolismo",
    excerpt:
      "Entenda a conexão entre descanso, hormônios, glicemia e saúde metabólica.",
    content: [
      "Durante o sono profundo, o corpo consolida memória imunológica e regula hormônios metabólicos.",
      "Privação crônica eleva cortisol, piora sensibilidade à insulina e compromete células de defesa.",
    ],
    category: "sono",
    categoryLabel: "Sono",
    author: "Dr. Rafael Costa",
    authorRole: "Neurociência do Sono",
    readTime: "7 min",
    publishedAt: "18 Mai 2026",
  },
  {
    id: "4",
    slug: "microbiota-saude-integral",
    title: "Microbiota intestinal: a base da saúde integral",
    excerpt:
      "Como o intestino influencia imunidade, humor, energia e envelhecimento saudável.",
    content: [
      "O eixo intestino-cérebro conecta microbiota, sistema imune e saúde mental de formas surpreendentes.",
      "Alimentos prebióticos, fibras diversas e redução de ultraprocessados são os pilares para microbiota saudável.",
    ],
    category: "saude-intestinal",
    categoryLabel: "Saúde Intestinal",
    author: "Nutr. Camila Ferreira",
    authorRole: "Nutrição Funcional",
    readTime: "9 min",
    publishedAt: "14 Mai 2026",
  },
  {
    id: "5",
    slug: "alimentacao-anti-inflamatoria",
    title: "Guia prático de alimentação anti-inflamatória",
    excerpt:
      "Alimentos, combinações e timing para reduzir inflamação crônica de baixo grau.",
    content: [
      "Inflamação crônica silenciosa acelera envelhecimento e impacta energia, peso e humor.",
      "Priorize vegetais coloridos, ômega-3, polifenóis e reduza açúcares refinados e ultraprocessados.",
    ],
    category: "alimentacao",
    categoryLabel: "Alimentação",
    author: "Nutr. Camila Ferreira",
    authorRole: "Nutrição Funcional",
    readTime: "10 min",
    publishedAt: "10 Mai 2026",
  },
  {
    id: "6",
    slug: "estresse-saude-mental-longevidade",
    title: "Estresse crônico e saúde mental na longevidade",
    excerpt:
      "Como o cortisol elevado acelera envelhecimento e o que fazer para reverter o ciclo.",
    content: [
      "Estresse crônico eleva cortisol, aumenta inflamação e compromete sono, imunidade e cognição.",
      "Respiração diafragmática, natureza, movimento moderado e limites digitais são intervenções com evidência.",
    ],
    category: "saude-mental",
    categoryLabel: "Saúde Mental",
    author: "Dra. Marina Alves",
    authorRole: "Medicina Preventiva",
    readTime: "7 min",
    publishedAt: "5 Mai 2026",
  },
  {
    id: "7",
    slug: "biomarcadores-longevidade",
    title: "Biomarcadores de longevidade que você pode acompanhar",
    excerpt:
      "HbA1c, PCR-us e triglicerídeos — o que pedir e como interpretar com seu médico.",
    content: [
      "Biomarcadores acessíveis oferecem snapshot valioso da saúde metabólica e inflamatória.",
      "Acompanhe tendências ao longo do tempo, não valores isolados, sempre com orientação profissional.",
    ],
    category: "longevidade",
    categoryLabel: "Longevidade",
    author: "Dr. Rafael Costa",
    authorRole: "Neurociência do Sono",
    readTime: "11 min",
    publishedAt: "1 Mai 2026",
  },
  {
    id: "8",
    slug: "rotina-matinal-energia",
    title: "A rotina matinal ideal para mais energia",
    excerpt:
      "5 hábitos matinais com respaldo científico para começar o dia com clareza e vigor.",
    content: [
      "Exposição solar nos primeiros 30 minutos, hidratação, movimento leve e proteína no café da manhã são os pilares.",
      "Evite celular e cafeína imediata — dê ao corpo tempo para ativar o ritmo circadiano naturalmente.",
    ],
    category: "energia",
    categoryLabel: "Energia",
    author: "Prof. André Lima",
    authorRole: "Fisiologia do Exercício",
    readTime: "5 min",
    publishedAt: "26 Abr 2026",
  },
];

export const blogArticles: BlogArticle[] = rawArticles.map((a) => ({
  ...withBase(a),
  contentBlocks: parseContentBlocks(a.content),
}));
export const featuredArticle = blogArticles.find((a) => a.featured)!;

export function isBlogCategory(id: string): id is BlogCategory | "todos" {
  return blogCategories.some((c) => c.id === id);
}
