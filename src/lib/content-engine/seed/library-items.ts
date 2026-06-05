import { DEFAULT_OG } from "./article-bodies";

function librarySeo(title: string, description: string, keywords: string) {
  return {
    long_description: description,
    seo_title: `${title} | Biblioteca Saúde & Bem`,
    seo_description: description,
    seo_keywords: keywords,
    og_image_url: DEFAULT_OG,
    image_url: DEFAULT_OG,
  };
}

/** 6 e-books — conteúdo real + SEO (Fase 5.1) */
export const CONTENT_ENGINE_LIBRARY_ITEMS = [
  {
    id: "d4000004-0004-4004-8004-000000000001",
    slug: "guia-hidratacao",
    title: "Guia da Hidratação",
    description:
      "Meta diária personalizada, sinais de desidratação e rotina prática para manter a hidratação ao longo do dia.",
    ...librarySeo(
      "Guia da Hidratação",
      "Aprenda a calcular sua meta de água, reconhecer desidratação e criar uma rotina simples de hidratação para mais energia e foco.",
      "hidratação, água, saúde, metabolismo",
    ),
    category: "hidratacao",
    category_label: "Hidratação",
    item_type: "ebook",
    tier: "free",
    is_premium: false,
    estimated_read_time: "8 min de leitura",
    featured: true,
    assets: { storagePath: "library/ebooks/guia-hidratacao.pdf" },
  },
  {
    id: "d4000004-0004-4004-8004-000000000002",
    slug: "checklist-saude-preventiva",
    title: "Checklist Saúde Preventiva",
    description:
      "Lista objetiva de exames, hábitos e alertas para acompanhamento preventivo anual.",
    ...librarySeo(
      "Checklist Saúde Preventiva",
      "Checklist anual com exames, hábitos e sinais de alerta para prevenção — material gratuito Saúde & Bem.",
      "prevenção, exames, checklist, saúde",
    ),
    category: "prevencao",
    category_label: "Prevenção",
    item_type: "ebook",
    tier: "free",
    is_premium: false,
    estimated_read_time: "5 min de leitura",
    featured: false,
    assets: { storagePath: "library/ebooks/checklist-saude-preventiva.pdf" },
  },
  {
    id: "d4000004-0004-4004-8004-000000000003",
    slug: "sono-reparador-ebook",
    title: "E-book Sono Reparador",
    description:
      "Guia completo de higiene do sono, ambiente ideal e rotinas noturnas para noites restauradoras.",
    ...librarySeo(
      "E-book Sono Reparador",
      "Protocolo prático de higiene do sono: ambiente, rotina noturna e hábitos para dormir melhor todas as noites.",
      "sono, insônia, higiene do sono, descanso",
    ),
    category: "sono",
    category_label: "Sono",
    item_type: "ebook",
    tier: "free",
    is_premium: false,
    estimated_read_time: "12 min de leitura",
    featured: false,
    assets: { storagePath: "library/ebooks/sono-reparador.pdf" },
  },
  {
    id: "d4000004-0004-4004-8004-000000000004",
    slug: "manual-longevidade",
    title: "Manual da Longevidade",
    description:
      "Estratégias baseadas em evidências para envelhecimento ativo — nutrição, movimento, sono e biomarcadores.",
    ...librarySeo(
      "Manual da Longevidade",
      "E-book premium com pilares da longevidade saudável: nutrição, exercício, sono, estresse e biomarcadores — exclusivo Clube.",
      "longevidade, envelhecimento, premium, clube",
    ),
    category: "longevidade",
    category_label: "Longevidade",
    item_type: "ebook",
    tier: "premium",
    is_premium: true,
    estimated_read_time: "45 min de leitura",
    featured: false,
    assets: { storagePath: "library/ebooks/manual-longevidade.pdf" },
  },
  {
    id: "d4000004-0004-4004-8004-000000000005",
    slug: "guia-emagrecimento-metabolico",
    title: "Guia Emagrecimento Metabólico",
    description:
      "Plano alimentar e hábitos para perda de gordura sustentável com foco em saúde metabólica e composição corporal.",
    ...librarySeo(
      "Guia Emagrecimento Metabólico",
      "Guia premium de emagrecimento sustentável: proteína, déficit inteligente, sono e treino — Clube Saúde & Bem.",
      "emagrecimento, metabolismo, composição corporal, premium",
    ),
    category: "emagrecimento",
    category_label: "Emagrecimento",
    item_type: "ebook",
    tier: "premium",
    is_premium: true,
    estimated_read_time: "35 min de leitura",
    featured: false,
    assets: { storagePath: "library/ebooks/emagrecimento-metabolico.pdf" },
  },
  {
    id: "d4000004-0004-4004-8004-000000000006",
    slug: "coracao-saudavel",
    title: "Coração Saudável",
    description:
      "E-book premium sobre prevenção cardiovascular, alimentação anti-inflamatória e monitoramento em casa.",
    ...librarySeo(
      "Coração Saudável",
      "Programa premium de prevenção cardiovascular: pressão arterial, colesterol, alimentação e hábitos — Clube Saúde & Bem.",
      "saúde cardiovascular, coração, colesterol, premium",
    ),
    category: "saude-cardiovascular",
    category_label: "Saúde Cardiovascular",
    item_type: "ebook",
    tier: "premium",
    is_premium: true,
    estimated_read_time: "40 min de leitura",
    featured: false,
    assets: { storagePath: "library/ebooks/coracao-saudavel.pdf" },
  },
] as const;
