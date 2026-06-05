import { ARTICLE_BODIES, DEFAULT_OG, seoForArticle } from "./article-bodies";

const baseArticles = [
  {
    slug: "hidratacao-meta-diaria",
    title: "Como calcular sua meta diária de hidratação",
    excerpt:
      "Volume ideal por peso, sinais de desidratação e rotina prática para manter a hidratação ao longo do dia.",
    category: "hidratacao",
    category_label: "Hidratação",
    author: "Dra. Marina Alves",
    author_role: "Medicina Preventiva",
    read_time: "8 min",
    published_at: "2026-05-28",
    featured: true,
    is_premium: false,
  },
  {
    slug: "agua-energia-cognicao",
    title: "Água, energia e cognição: o que a ciência diz",
    excerpt:
      "Desidratação leve reduz foco e humor — entenda como a água impacta performance mental.",
    category: "hidratacao",
    category_label: "Hidratação",
    author: "Dr. Rafael Costa",
    author_role: "Nutrição Clínica",
    read_time: "7 min",
    published_at: "2026-05-20",
    featured: false,
    is_premium: false,
  },
  {
    slug: "sono-imunidade-metabolismo",
    title: "Como o sono impacta imunidade e metabolismo",
    excerpt:
      "Entenda a conexão entre descanso, hormônios, glicemia e saúde metabólica.",
    category: "sono",
    category_label: "Sono",
    author: "Dr. Rafael Costa",
    author_role: "Neurociência do Sono",
    read_time: "9 min",
    published_at: "2026-05-18",
    featured: false,
    is_premium: false,
  },
  {
    slug: "higiene-sono-guia",
    title: "Guia prático de higiene do sono",
    excerpt:
      "Ambiente, rotina e hábitos noturnos para recuperação profunda e consistente.",
    category: "sono",
    category_label: "Sono",
    author: "Dra. Marina Alves",
    author_role: "Medicina Preventiva",
    read_time: "8 min",
    published_at: "2026-05-12",
    featured: false,
    is_premium: false,
  },
  {
    slug: "emagrecimento-sustentavel",
    title: "Emagrecimento sustentável: além da balança",
    excerpt:
      "Déficit calórico inteligente, proteína adequada e hábitos que mantêm resultados.",
    category: "emagrecimento",
    category_label: "Emagrecimento",
    author: "Dra. Marina Alves",
    author_role: "Medicina Preventiva",
    read_time: "10 min",
    published_at: "2026-05-15",
    featured: true,
    is_premium: false,
  },
  {
    slug: "plateau-emagrecimento",
    title: "Plateau no emagrecimento: o que fazer",
    excerpt:
      "Por que a perda de peso estagna e estratégias baseadas em evidências para retomar progresso.",
    category: "emagrecimento",
    category_label: "Emagrecimento",
    author: "Dr. Rafael Costa",
    author_role: "Nutrição Clínica",
    read_time: "8 min",
    published_at: "2026-05-08",
    featured: false,
    is_premium: false,
  },
  {
    slug: "pressao-arterial-prevencao",
    title: "Pressão arterial: prevenção no dia a dia",
    excerpt:
      "Hábitos alimentares, movimento e monitoramento para saúde cardiovascular.",
    category: "saude-cardiovascular",
    category_label: "Saúde Cardiovascular",
    author: "Dra. Marina Alves",
    author_role: "Medicina Preventiva",
    read_time: "9 min",
    published_at: "2026-05-10",
    featured: false,
    is_premium: false,
  },
  {
    slug: "colesterol-hdl-triglicerides",
    title: "Colesterol, HDL e triglicerídeos explicados",
    excerpt:
      "O que os exames significam e como hábitos influenciam o perfil lipídico.",
    category: "saude-cardiovascular",
    category_label: "Saúde Cardiovascular",
    author: "Dr. Rafael Costa",
    author_role: "Cardiologia Preventiva",
    read_time: "11 min",
    published_at: "2026-05-05",
    featured: false,
    is_premium: true,
  },
  {
    slug: "pilares-longevidade-2026",
    title: "Os 5 pilares da longevidade que a ciência confirma",
    excerpt:
      "Descubra os hábitos com maior evidência científica para viver mais e melhor.",
    category: "longevidade",
    category_label: "Longevidade",
    author: "Dra. Marina Alves",
    author_role: "Medicina Preventiva",
    read_time: "10 min",
    published_at: "2026-05-28",
    featured: true,
    is_premium: false,
  },
  {
    slug: "biomarcadores-envelhecimento",
    title: "Biomarcadores do envelhecimento saudável",
    excerpt:
      "Exames e indicadores que acompanham saúde metabólica, inflamação e vitalidade.",
    category: "longevidade",
    category_label: "Longevidade",
    author: "Dr. Rafael Costa",
    author_role: "Medicina Preventiva",
    read_time: "10 min",
    published_at: "2026-05-01",
    featured: false,
    is_premium: true,
  },
] as const;

/** 10 artigos editoriais — Fase 5.1 (conteúdo real + SEO) */
export const CONTENT_ENGINE_ARTICLES = baseArticles.map((article) => {
  const seo = seoForArticle(article.slug, article.title, article.excerpt);
  return {
    ...article,
    content: [...(ARTICLE_BODIES[article.slug] ?? [])],
    ...seo,
  };
});

export { DEFAULT_OG };
