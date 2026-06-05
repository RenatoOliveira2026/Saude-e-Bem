/**
 * Gera seeds SQL a partir do Content Engine (Fase 5.0 / 5.1).
 * Uso: npm run generate:content-seed
 * Execute 026_seo_content_engine.sql antes de re-seedar biblioteca/marketplace.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ARTICLE_BODIES,
  DEFAULT_OG,
  seoForArticle,
} from "./article-bodies.mjs";
import {
  CONTENT_ENGINE_ARTICLES,
  CONTENT_ENGINE_LIBRARY_ITEMS,
  CONTENT_ENGINE_MARKETPLACE_PRODUCTS,
} from "./content-engine-seed-data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const articleIds = CONTENT_ENGINE_ARTICLES.map(
  (_, i) =>
    `a1000001-0001-4001-8001-${String(i + 1).padStart(12, "0")}`,
);

const protocolIds = [
  "b2000002-0002-4002-8002-000000000001",
  "b2000002-0002-4002-8002-000000000002",
  "b2000002-0002-4002-8002-000000000003",
  "b2000002-0002-4002-8002-000000000004",
  "b2000002-0002-4002-8002-000000000005",
  "b2000002-0002-4002-8002-000000000006",
];

const ebookIds = [
  "c3000003-0003-4003-8003-000000000001",
  "c3000003-0003-4003-8003-000000000002",
  "c3000003-0003-4003-8003-000000000003",
  "c3000003-0003-4003-8003-000000000004",
  "c3000003-0003-4003-8003-000000000005",
];

function sqlStr(s) {
  return `'${String(s).replace(/'/g, "''")}'`;
}

function sqlJson(obj) {
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function sqlNullableStr(s) {
  return s == null || s === "" ? "null" : sqlStr(s);
}

function sqlNum(n) {
  return n == null ? "null" : String(n);
}

function sqlTextArray(arr) {
  if (!arr?.length) return "'{}'::text[]";
  const inner = arr.map((v) => sqlStr(v)).join(", ");
  return `array[${inner}]::text[]`;
}

function enrichArticle(article) {
  const content = ARTICLE_BODIES[article.slug] ?? article.content ?? [];
  const seo = seoForArticle(article.slug, article.title, article.excerpt);
  return { ...article, content: [...content], ...seo };
}

function librarySeoDefaults(item) {
  return {
    long_description: item.long_description ?? item.description,
    seo_title: item.seo_title ?? `${item.title} | Biblioteca Saúde & Bem`,
    seo_description: item.seo_description ?? item.description,
    seo_keywords: item.seo_keywords ?? item.category,
    og_image_url: item.og_image_url ?? DEFAULT_OG,
    image_url: item.image_url ?? DEFAULT_OG,
  };
}

function marketplaceSeoDefaults(product) {
  return {
    seo_title: product.seo_title ?? `${product.title} | Marketplace Saúde & Bem`,
    seo_description: product.seo_description ?? product.description,
    seo_keywords: product.seo_keywords ?? product.category,
    og_image_url: product.og_image_url ?? DEFAULT_OG,
    image_url: product.image_url ?? DEFAULT_OG,
  };
}

const ENRICHED_ARTICLES = CONTENT_ENGINE_ARTICLES.map(enrichArticle);

const protocols = [
  {
    slug: "energia-diaria",
    title: "Energia Diária",
    description:
      "Rotina matinal e hábitos diários para vitalidade consistente, sem depender de estimulantes artificiais.",
    objective: "Manter energia estável e foco ao longo de todo o dia.",
    long_description:
      "Protocolo de 14 dias que reorganiza seu ritmo circadiano, alimentação matinal e micro-hábitos para energia sustentável baseada em ciência.",
    category: "energia",
    category_label: "Energia",
    duration: "14 dias",
    level: "Iniciante",
    benefits: ["Foco prolongado", "Menos fadiga vespertina", "Sono mais reparador"],
    steps: [
      { title: "Dias 1–5", description: "Exposição solar matinal e hidratação estratégica." },
      { title: "Dias 6–10", description: "Alimentação energizante e movimento leve." },
      { title: "Dias 11–14", description: "Rotina consolidada personalizada." },
    ],
    is_premium: false,
    featured: true,
    tag: "Mais popular",
    participants: 3240,
  },
  {
    slug: "sono-reparador",
    title: "Sono Reparador",
    description:
      "Resete seu ritmo circadiano com higiene do sono baseada em evidências científicas.",
    objective: "Dormir mais rápido, profundamente e acordar com disposição.",
    long_description:
      "Em 7 dias, você implementará rotinas noturnas, otimização do ambiente e estratégias comportamentais para noites restauradoras.",
    category: "sono",
    category_label: "Sono",
    duration: "7 dias",
    level: "Iniciante",
    benefits: ["Latência reduzida", "Mais energia matinal", "Humor equilibrado"],
    steps: [
      { title: "Dia 1–2", description: "Mapeamento do ritmo e horários fixos." },
      { title: "Dia 3–4", description: "Ambiente e redução de luz azul." },
      { title: "Dia 5–7", description: "Rotina noturna consolidada." },
    ],
    is_premium: false,
    featured: false,
    tag: null,
    participants: 4120,
  },
  {
    slug: "saude-intestinal",
    title: "Saúde Intestinal",
    description:
      "Restaure o equilíbrio da microbiota com alimentação funcional e hábitos de lifestyle.",
    objective: "Melhorar digestão, absorção de nutrientes e bem-estar intestinal.",
    long_description:
      "Protocolo de 21 dias focado em fibras prebióticas, probióticos naturais, redução de inflamação intestinal e reconexão intestino-cérebro.",
    category: "intestinal",
    category_label: "Saúde Intestinal",
    duration: "21 dias",
    level: "Intermediário",
    benefits: ["Digestão otimizada", "Menos inchaço", "Imunidade fortalecida"],
    steps: [
      { title: "Semana 1", description: "Eliminação de provocadores intestinais." },
      { title: "Semana 2", description: "Introdução de alimentos funcionais." },
      { title: "Semana 3", description: "Consolidação e personalização." },
    ],
    is_premium: false,
    featured: false,
    tag: null,
    participants: 2890,
  },
  {
    slug: "detox-natural",
    title: "Detox Natural",
    description:
      "Desintoxicação gentil e sustentável — sem dietas restritivas ou promessas milagrosas.",
    objective: "Apoiar funções naturais de detoxificação do fígado e eliminação de toxinas.",
    long_description:
      "Plano de 10 dias com alimentos detoxificantes, hidratação, movimento e sono para apoiar os processos naturais do corpo.",
    category: "detox",
    category_label: "Detox",
    duration: "10 dias",
    level: "Iniciante",
    benefits: ["Mais leveza", "Pele radiante", "Clareza mental"],
    steps: [
      { title: "Dias 1–3", description: "Hidratação e alimentos crucíferos." },
      { title: "Dias 4–7", description: "Suporte hepático e eliminação." },
      { title: "Dias 8–10", description: "Reintrodução consciente." },
    ],
    is_premium: false,
    featured: false,
    tag: null,
    participants: 1950,
  },
  {
    slug: "longevidade-saudavel",
    title: "Longevidade Saudável",
    description:
      "Os pilares comprovados da ciência para envelhecer com qualidade, vitalidade e independência.",
    objective: "Implementar hábitos de longevidade baseados em evidências científicas.",
    long_description:
      "Protocolo integrado de 90 dias cobrindo nutrição, movimento, sono, gestão do estresse e biomarcadores de envelhecimento saudável.",
    category: "longevidade",
    category_label: "Longevidade",
    duration: "90 dias",
    level: "Avançado",
    benefits: ["Marcadores otimizados", "Mais energia", "Resiliência biológica"],
    steps: [
      { title: "Fase 1", description: "Baseline e avaliação de biomarcadores." },
      { title: "Fase 2", description: "Implementação dos 5 pilares." },
      { title: "Fase 3", description: "Otimização e manutenção." },
    ],
    is_premium: true,
    featured: false,
    tag: "Premium",
    participants: 870,
  },
  {
    slug: "menopausa-saudavel",
    title: "Menopausa Saudável",
    description:
      "Acompanhamento integrado para equilíbrio hormonal, energia e bem-estar na maturidade feminina.",
    objective: "Navegar a menopausa com vitalidade, clareza e qualidade de vida.",
    long_description:
      "Protocolo de 30 dias com foco em nutrição hormonal, movimento adaptado, gestão de sintomas e saúde óssea e cardiovascular.",
    category: "menopausa",
    category_label: "Menopausa",
    duration: "30 dias",
    level: "Intermediário",
    benefits: ["Equilíbrio hormonal", "Ossos fortes", "Energia estável"],
    steps: [
      { title: "Semana 1", description: "Mapeamento de sintomas e alimentação base." },
      { title: "Semana 2", description: "Movimento e suplementação estratégica." },
      { title: "Semanas 3–4", description: "Consolidação e acompanhamento." },
    ],
    is_premium: true,
    featured: false,
    tag: null,
    participants: 640,
  },
];

const ebooks = [
  {
    slug: "guia-detox-inteligente",
    title: "Guia Detox Inteligente",
    description:
      "Desintoxicação gentil e sustentável — alimentos, hábitos e protocolos para apoiar o fígado naturalmente.",
    long_description:
      "Guia completo de 24 páginas com plano de 10 dias, lista de alimentos detoxificantes e receitas práticas.",
    category: "Detox",
    category_label: "Detox",
    icon: "leaf",
    format: "PDF",
    pages: 24,
    highlights: ["Plano de 10 dias", "Alimentos detox", "Receitas práticas"],
    is_premium: false,
    downloads: 4820,
    featured: true,
  },
  {
    slug: "guia-energia-natural",
    title: "Guia Energia Natural",
    description:
      "Estratégias circadianas e nutricionais para vitalidade consistente sem depender de cafeína.",
    long_description:
      "Manual de 20 páginas com rotina matinal, alimentos energizantes e protocolos de movimento leve.",
    category: "Energia",
    category_label: "Energia",
    icon: "bolt",
    format: "PDF",
    pages: 20,
    highlights: ["Rotina matinal", "Alimentos-chave", "Protocolo de 14 dias"],
    is_premium: false,
    downloads: 3650,
    featured: false,
  },
  {
    slug: "guia-sono-saudavel",
    title: "Guia Sono Saudável",
    description:
      "Protocolos práticos para higiene do sono, ambiente ideal e rotinas noturnas reparadoras.",
    long_description:
      "Guia de 18 páginas com checklist de ambiente, suplementação baseada em evidências e plano de 7 dias.",
    category: "Sono",
    category_label: "Sono",
    icon: "moon",
    format: "PDF",
    pages: 18,
    highlights: ["Checklist do quarto", "Rotina noturna", "Plano de 7 dias"],
    is_premium: false,
    downloads: 3910,
    featured: false,
  },
  {
    slug: "guia-habitos-saudaveis",
    title: "Guia Hábitos Saudáveis",
    description:
      "Como construir e manter hábitos duradouros de saúde com base em ciência comportamental.",
    long_description:
      "Guia de 16 páginas sobre formação de hábitos, stacking, triggers e estratégias de consistência.",
    category: "Hábitos",
    category_label: "Hábitos",
    icon: "checklist",
    format: "PDF",
    pages: 16,
    highlights: ["Ciência comportamental", "Habit stacking", "Plano semanal"],
    is_premium: false,
    downloads: 2780,
    featured: false,
  },
  {
    slug: "guia-saude-intestinal",
    title: "Guia Saúde Intestinal",
    description:
      "Microbiota, alimentos prebióticos e protocolos para restaurar o equilíbrio digestivo.",
    long_description:
      "Manual de 22 páginas sobre eixo intestino-cérebro, alimentos funcionais e plano de 21 dias.",
    category: "Intestinal",
    category_label: "Saúde Intestinal",
    icon: "vitality",
    format: "PDF",
    pages: 22,
    highlights: ["Microbiota", "Alimentos prebióticos", "Plano de 21 dias"],
    is_premium: false,
    downloads: 3240,
    featured: false,
  },
];

function buildCmsSeedLines() {
  const lines = [
    "-- =============================================================================",
    "-- Saúde & Bem — Seed CMS (Fase 5.0)",
    "-- Gerado por scripts/generate-content-seed.mjs",
    "-- Execute após 002_content_and_favorites.sql",
    "-- =============================================================================",
    "",
    "delete from public.favorites where content_id in (",
    "  select id from public.articles where id::text like 'a1000001-%'",
    "  union select id from public.protocols where id::text like 'b2000002-%'",
    "  union select id from public.ebooks where id::text like 'c3000003-%'",
    ");",
    "delete from public.articles where id::text like 'a1000001-%';",
    "delete from public.protocols where id::text like 'b2000002-%';",
    "delete from public.ebooks where id::text like 'c3000003-%';",
    "",
    "-- Articles (10)",
  ];

  for (let i = 0; i < ENRICHED_ARTICLES.length; i++) {
    const a = ENRICHED_ARTICLES[i];
    lines.push(
      `insert into public.articles (id, slug, title, excerpt, content, category, category_label, author, author_role, read_time, published_at, featured, is_premium, cover_image_url, seo_title, seo_description, seo_keywords, og_image_url, status) values (` +
        `${sqlStr(articleIds[i])}, ${sqlStr(a.slug)}, ${sqlStr(a.title)}, ${sqlStr(a.excerpt)}, ${sqlJson(a.content)}, ` +
        `${sqlStr(a.category)}, ${sqlStr(a.category_label)}, ${sqlStr(a.author)}, ${sqlStr(a.author_role)}, ` +
        `${sqlStr(a.read_time)}, ${sqlStr(a.published_at)}, ${a.featured}, ${a.is_premium}, ` +
        `${sqlNullableStr(a.cover_image_url)}, ${sqlNullableStr(a.seo_title)}, ${sqlNullableStr(a.seo_description)}, ` +
        `${sqlNullableStr(a.seo_keywords)}, ${sqlNullableStr(a.og_image_url)}, 'published');`,
    );
  }

  lines.push("", "-- Protocols");
  for (let i = 0; i < protocols.length; i++) {
    const p = protocols[i];
    lines.push(
      `insert into public.protocols (id, slug, title, description, objective, long_description, category, category_label, duration, level, benefits, steps, is_premium, featured, tag, participants, status) values (` +
        `${sqlStr(protocolIds[i])}, ${sqlStr(p.slug)}, ${sqlStr(p.title)}, ${sqlStr(p.description)}, ${sqlStr(p.objective)}, ${sqlStr(p.long_description)}, ` +
        `${sqlStr(p.category)}, ${sqlStr(p.category_label)}, ${sqlStr(p.duration)}, ${sqlStr(p.level)}, ${sqlJson(p.benefits)}, ${sqlJson(p.steps)}, ` +
        `${p.is_premium}, ${p.featured}, ${p.tag ? sqlStr(p.tag) : "null"}, ${p.participants}, 'published');`,
    );
  }

  lines.push("", "-- Ebooks (legacy CMS)");
  for (let i = 0; i < ebooks.length; i++) {
    const e = ebooks[i];
    lines.push(
      `insert into public.ebooks (id, slug, title, description, long_description, category, category_label, icon, format, pages, highlights, is_premium, downloads, featured, status) values (` +
        `${sqlStr(ebookIds[i])}, ${sqlStr(e.slug)}, ${sqlStr(e.title)}, ${sqlStr(e.description)}, ${sqlStr(e.long_description)}, ` +
        `${sqlStr(e.category)}, ${sqlStr(e.category_label)}, ${sqlStr(e.icon)}, ${sqlStr(e.format)}, ${e.pages}, ${sqlJson(e.highlights)}, ` +
        `${e.is_premium}, ${e.downloads}, ${e.featured}, 'published');`,
    );
  }

  lines.push(
    "",
    "select 'articles' as table_name, count(*) as row_count from public.articles",
    "union all select 'protocols', count(*) from public.protocols",
    "union all select 'ebooks', count(*) from public.ebooks;",
  );

  return lines;
}

function buildContentEngineSeedLines() {
  const lines = [
    "-- =============================================================================",
    "-- Saúde & Bem — Seed Content Engine (Fase 5.0 / 5.1)",
    "-- Gerado por scripts/generate-content-seed.mjs",
    "-- Execute após 024_content_engine.sql e 026_seo_content_engine.sql",
    "-- =============================================================================",
    "",
    "delete from public.marketplace_products where id::text like 'e5000005-%';",
    "delete from public.library_items where id::text like 'd4000004-%';",
    "",
    "-- library_items (6 e-books)",
  ];

  for (const raw of CONTENT_ENGINE_LIBRARY_ITEMS) {
    const item = { ...raw, ...librarySeoDefaults(raw) };
    lines.push(
      `insert into public.library_items (id, slug, title, description, long_description, category, category_label, item_type, tier, is_premium, image_url, estimated_read_time, featured, assets, seo_title, seo_description, seo_keywords, og_image_url, status) values (` +
        `${sqlStr(item.id)}, ${sqlStr(item.slug)}, ${sqlStr(item.title)}, ${sqlStr(item.description)}, ${sqlStr(item.long_description)}, ` +
        `${sqlStr(item.category)}, ${sqlStr(item.category_label)}, ${sqlStr(item.item_type)}, ${sqlStr(item.tier)}, ` +
        `${item.is_premium}, ${sqlNullableStr(item.image_url)}, ${sqlStr(item.estimated_read_time)}, ${item.featured}, ${sqlJson(item.assets)}, ` +
        `${sqlNullableStr(item.seo_title)}, ${sqlNullableStr(item.seo_description)}, ${sqlNullableStr(item.seo_keywords)}, ${sqlNullableStr(item.og_image_url)}, 'published');`,
    );
  }

  lines.push("", "-- marketplace_products (10)");
  for (const raw of CONTENT_ENGINE_MARKETPLACE_PRODUCTS) {
    const p = { ...raw, ...marketplaceSeoDefaults(raw) };
    lines.push(
      `insert into public.marketplace_products (id, slug, title, description, category, category_label, product_type, fulfillment, is_premium, image_url, current_price, old_price, installments, featured, editor_choice, library_slug, affiliate_slug, health_tags, seo_title, seo_description, seo_keywords, og_image_url, status) values (` +
        `${sqlStr(p.id)}, ${sqlStr(p.slug)}, ${sqlStr(p.title)}, ${sqlStr(p.description)}, ` +
        `${sqlStr(p.category)}, ${sqlStr(p.category_label)}, ${sqlStr(p.product_type)}, ${sqlStr(p.fulfillment)}, ` +
        `${p.is_premium}, ${sqlNullableStr(p.image_url)}, ${sqlNum(p.current_price ?? null)}, ${sqlNum(p.old_price ?? null)}, ${sqlNullableStr(p.installments ?? null)}, ` +
        `${p.featured}, ${p.editor_choice}, ${sqlNullableStr(p.library_slug ?? null)}, ${sqlNullableStr(p.affiliate_slug ?? null)}, ` +
        `${sqlTextArray(p.health_tags ?? [])}, ${sqlNullableStr(p.seo_title)}, ${sqlNullableStr(p.seo_description)}, ${sqlNullableStr(p.seo_keywords)}, ${sqlNullableStr(p.og_image_url)}, 'published');`,
    );
  }

  lines.push(
    "",
    "select 'library_items' as table_name, count(*) as row_count from public.library_items",
    "union all select 'marketplace_products', count(*) from public.marketplace_products;",
  );

  return lines;
}

const cmsPath = join(root, "supabase", "migrations", "003_seed_content.sql");
const enginePath = join(root, "supabase", "migrations", "025_seed_content_engine.sql");

writeFileSync(cmsPath, buildCmsSeedLines().join("\n") + "\n", "utf8");
writeFileSync(enginePath, buildContentEngineSeedLines().join("\n") + "\n", "utf8");

console.log(`Seed CMS gerado: ${cmsPath}`);
console.log(`Seed Content Engine gerado: ${enginePath}`);
