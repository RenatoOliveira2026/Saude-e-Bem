/** Builder e metadados — Fase 7.1A SEO inicial */

export const CATEGORY_COVERS = {
  sono: "/blog/categories/sono.svg",
  hidratacao: "/blog/categories/hidratacao.svg",
  emagrecimento: "/blog/categories/emagrecimento.svg",
  longevidade: "/blog/categories/longevidade.svg",
  "saude-cardiovascular": "/blog/categories/saude-cardiovascular.svg",
};

const AUTHORS = [
  { author: "Dra. Marina Alves", author_role: "Medicina Preventiva" },
  { author: "Dr. Rafael Costa", author_role: "Nutrição Clínica" },
];

export function buildArticleBlocks(def) {
  const cover = CATEGORY_COVERS[def.category] ?? "/logo-saude-bem.png";
  return [
    { type: "image", url: cover, alt: `Capa: ${def.title}` },
    { type: "heading", level: 2, text: "Introdução" },
    ...def.intro.map((text) => ({ type: "paragraph", text })),
    { type: "heading", level: 2, text: "Benefícios" },
    { type: "list", items: def.benefits },
    { type: "heading", level: 2, text: "Como aplicar" },
    { type: "list", items: def.howToApply, ordered: true },
    { type: "heading", level: 2, text: "Erros comuns" },
    { type: "list", items: def.mistakes },
    { type: "heading", level: 2, text: "Perguntas frequentes" },
    { type: "faq", items: def.faq },
    { type: "heading", level: 2, text: "Conclusão" },
    ...def.conclusion.map((text) => ({ type: "paragraph", text })),
    { type: "heading", level: 2, text: "Continue no Clube Saúde & Bem" },
    {
      type: "paragraph",
      html:
        '<p>Quer protocolos premium, biblioteca ampliada e acompanhamento contínuo? O <strong>Clube Saúde &amp; Bem</strong> reúne ferramentas avançadas e conteúdo exclusivo para acelerar sua jornada.</p><p><a href="/clube">Conhecer o Clube Premium</a> · <a href="/assinar">Ver planos</a></p>',
    },
  ];
}

export function seoForArticle(slug, title, excerpt, category) {
  const keywords = [
    ...slug.split("-"),
    category.replace(/-/g, " "),
    "saúde",
    "bem-estar",
    "saúde e bem",
  ].join(", ");
  return {
    seo_title: `${title} | Guia Saúde & Bem`,
    seo_description: excerpt.slice(0, 160),
    seo_keywords: keywords,
    og_image_url: CATEGORY_COVERS[category] ?? "/logo-saude-bem.png",
    cover_image_url: CATEGORY_COVERS[category] ?? "/logo-saude-bem.png",
  };
}

export function enrichArticle(def, index) {
  const authorMeta = AUTHORS[index % AUTHORS.length];
  const content = buildArticleBlocks(def);
  const seo = seoForArticle(def.slug, def.title, def.excerpt, def.category);
  return {
    ...def,
    ...authorMeta,
    category_label: def.category_label,
    read_time: def.read_time ?? "8 min",
    featured: def.featured ?? false,
    is_premium: false,
    status: "published",
    content,
    ...seo,
  };
}
