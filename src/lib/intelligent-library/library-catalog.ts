import type { LibraryItem } from "./library.types";

/**
 * Catálogo mockado — Fase 4.6.
 * Substituível por Supabase (`library_items`) sem alterar a UI.
 */
export const INTELLIGENT_LIBRARY_CATALOG: LibraryItem[] = [
  {
    id: "lib-001",
    slug: "guia-hidratacao",
    title: "Guia da Hidratação",
    description:
      "Meta diária personalizada, sinais de desidratação e rotina prática para manter a hidratação ao longo do dia.",
    category: "Hidratação",
    type: "ebook",
    isPremium: false,
    estimatedReadTime: "8 min de leitura",
    featured: true,
    assets: {
      storagePath: "library/ebooks/guia-hidratacao.pdf",
    },
  },
  {
    id: "lib-002",
    slug: "checklist-saude-preventiva",
    title: "Checklist Saúde Preventiva",
    description:
      "Lista objetiva de exames, hábitos e alertas para acompanhamento preventivo anual.",
    category: "Prevenção",
    type: "ebook",
    isPremium: false,
    estimatedReadTime: "5 min de leitura",
    assets: {
      storagePath: "library/ebooks/checklist-saude-preventiva.pdf",
    },
  },
  {
    id: "lib-003",
    slug: "manual-longevidade",
    title: "Manual da Longevidade",
    description:
      "Estratégias baseadas em evidências para envelhecimento ativo — nutrição, movimento, sono e biomarcadores.",
    category: "Longevidade",
    type: "ebook",
    isPremium: true,
    estimatedReadTime: "45 min de leitura",
    assets: {
      storagePath: "library/ebooks/manual-longevidade.pdf",
    },
  },
  {
    id: "lib-004",
    slug: "protocolo-energia-diaria",
    title: "Protocolo Energia Diária",
    description:
      "Plano de 21 dias com rotina matinal, alimentação energizante e micro-hábitos para vitalidade consistente.",
    category: "Energia",
    type: "protocolo",
    isPremium: false,
    estimatedReadTime: "21 dias",
    assets: {
      storagePath: "library/protocolos/energia-diaria.pdf",
    },
  },
  {
    id: "lib-005",
    slug: "sono-reparador",
    title: "Sono Reparador",
    description:
      "Protocolo de higiene do sono, ambiente ideal e rotinas noturnas para recuperação profunda.",
    category: "Sono",
    type: "protocolo",
    isPremium: false,
    estimatedReadTime: "14 dias",
    assets: {
      storagePath: "library/protocolos/sono-reparador.pdf",
    },
  },
  {
    id: "lib-006",
    slug: "plano-saude-metabolica",
    title: "Plano Saúde Metabólica",
    description:
      "Programa estruturado de 28 dias para equilíbrio glicêmico, composição corporal e hábitos metabólicos.",
    category: "Metabolismo",
    type: "protocolo",
    isPremium: true,
    estimatedReadTime: "28 dias",
    assets: {
      storagePath: "library/protocolos/saude-metabolica.pdf",
    },
  },
  {
    id: "lib-007",
    slug: "rotina-matinal-video",
    title: "Rotina Matinal em 10 Minutos",
    description:
      "Vídeo guiado com alongamento, respiração e ativação circadiana para começar o dia com energia.",
    category: "Hábitos",
    type: "video",
    isPremium: false,
    estimatedReadTime: "10 min",
    assets: {
      storagePath: "library/videos/rotina-matinal.mp4",
      videoUrl: undefined,
    },
  },
  {
    id: "lib-008",
    slug: "masterclass-longevidade",
    title: "Masterclass Longevidade Ativa",
    description:
      "Aula completa sobre pilares da longevidade — exclusiva para assinantes do Clube Saúde & Bem.",
    category: "Longevidade",
    type: "video",
    isPremium: true,
    estimatedReadTime: "52 min",
    assets: {
      storagePath: "library/videos/masterclass-longevidade.mp4",
      videoUrl: undefined,
    },
  },
];

export function getCatalogItemBySlug(slug: string): LibraryItem | undefined {
  return INTELLIGENT_LIBRARY_CATALOG.find((item) => item.slug === slug);
}

export function getFeaturedCatalogItem(): LibraryItem | undefined {
  return (
    INTELLIGENT_LIBRARY_CATALOG.find((item) => item.featured) ??
    INTELLIGENT_LIBRARY_CATALOG[0]
  );
}
