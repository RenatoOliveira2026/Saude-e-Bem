/**
 * Gera supabase/migrations/003_seed_content.sql a partir dos mocks.
 * Uso: node scripts/generate-content-seed.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// IDs determinísticos para seed reproduzível
const articleIds = [
  "a1000001-0001-4001-8001-000000000001",
  "a1000001-0001-4001-8001-000000000002",
  "a1000001-0001-4001-8001-000000000003",
  "a1000001-0001-4001-8001-000000000004",
  "a1000001-0001-4001-8001-000000000005",
  "a1000001-0001-4001-8001-000000000006",
  "a1000001-0001-4001-8001-000000000007",
  "a1000001-0001-4001-8001-000000000008",
];

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

function sqlJson(arr) {
  return `'${JSON.stringify(arr).replace(/'/g, "''")}'::jsonb`;
}

const articles = [
  {
    slug: "pilares-longevidade-2026",
    title: "Os 5 pilares da longevidade que a ciência confirma",
    excerpt:
      "Descubra os hábitos com maior evidência científica para viver mais e melhor — sem modismos ou promessas vazias.",
    content: [
      "A longevidade de qualidade nasce de hábitos consistentes com respaldo científico. Em 2026, cinco pilares se destacam na literatura.",
      "Sono reparador, nutrição anti-inflamatória, movimento regular, gestão do estresse e conexões sociais formam a base de uma vida longa e plena.",
    ],
    category: "longevidade",
    category_label: "Longevidade",
    author: "Dra. Marina Alves",
    author_role: "Medicina Preventiva",
    read_time: "8 min",
    published_at: "28 Mai 2026",
    featured: true,
  },
  {
    slug: "energia-sem-cafeina",
    title: "Energia sustentável sem depender de cafeína",
    excerpt:
      "Estratégias circadianas e nutricionais para manter vitalidade consistente ao longo do dia.",
    content: [
      "Energia sustentável vem de ritmo circadiano alinhado, hidratação, proteína no café da manhã e exposição solar matinal.",
      "Cafeína após 14h pode comprometer sono e criar ciclo de dependência energética que mascarar fadiga crônica.",
    ],
    category: "energia",
    category_label: "Energia",
    author: "Dra. Marina Alves",
    author_role: "Medicina Preventiva",
    read_time: "6 min",
    published_at: "22 Mai 2026",
    featured: false,
  },
  {
    slug: "sono-imunidade-metabolismo",
    title: "Como o sono impacta imunidade e metabolismo",
    excerpt:
      "Entenda a conexão entre descanso, hormônios, glicemia e saúde metabólica.",
    content: [
      "Durante o sono profundo, o corpo consolida memória imunológica e regula hormônios metabólicos.",
      "Privação crônica eleva cortisol, piora sensibilidade à insulina e compromete células de defesa.",
    ],
    category: "sono",
    category_label: "Sono",
    author: "Dr. Rafael Costa",
    author_role: "Neurociência do Sono",
    read_time: "7 min",
    published_at: "18 Mai 2026",
    featured: false,
  },
  {
    slug: "microbiota-saude-integral",
    title: "Microbiota intestinal: a base da saúde integral",
    excerpt:
      "Como o intestino influencia imunidade, humor, energia e envelhecimento saudável.",
    content: [
      "O eixo intestino-cérebro conecta microbiota, sistema imune e saúde mental de formas surpreendentes.",
      "Alimentos prebióticos, fibras diversas e redução de ultraprocessados são os pilares para microbiota saudável.",
    ],
    category: "saude-intestinal",
    category_label: "Saúde Intestinal",
    author: "Nutr. Camila Ferreira",
    author_role: "Nutrição Funcional",
    read_time: "9 min",
    published_at: "14 Mai 2026",
    featured: false,
  },
  {
    slug: "alimentacao-anti-inflamatoria",
    title: "Guia prático de alimentação anti-inflamatória",
    excerpt:
      "Alimentos, combinações e timing para reduzir inflamação crônica de baixo grau.",
    content: [
      "Inflamação crônica silenciosa acelera envelhecimento e impacta energia, peso e humor.",
      "Priorize vegetais coloridos, ômega-3, polifenóis e reduza açúcares refinados e ultraprocessados.",
    ],
    category: "alimentacao",
    category_label: "Alimentação",
    author: "Nutr. Camila Ferreira",
    author_role: "Nutrição Funcional",
    read_time: "10 min",
    published_at: "10 Mai 2026",
    featured: false,
  },
  {
    slug: "estresse-saude-mental-longevidade",
    title: "Estresse crônico e saúde mental na longevidade",
    excerpt:
      "Como o cortisol elevado acelera envelhecimento e o que fazer para reverter o ciclo.",
    content: [
      "Estresse crônico eleva cortisol, aumenta inflamação e compromete sono, imunidade e cognição.",
      "Respiração diafragmática, natureza, movimento moderado e limites digitais são intervenções com evidência.",
    ],
    category: "saude-mental",
    category_label: "Saúde Mental",
    author: "Dra. Marina Alves",
    author_role: "Medicina Preventiva",
    read_time: "7 min",
    published_at: "5 Mai 2026",
    featured: false,
  },
  {
    slug: "biomarcadores-longevidade",
    title: "Biomarcadores de longevidade que você pode acompanhar",
    excerpt:
      "HbA1c, PCR-us e triglicerídeos — o que pedir e como interpretar com seu médico.",
    content: [
      "Biomarcadores acessíveis oferecem snapshot valioso da saúde metabólica e inflamatória.",
      "Acompanhe tendências ao longo do tempo, não valores isolados, sempre com orientação profissional.",
    ],
    category: "longevidade",
    category_label: "Longevidade",
    author: "Dr. Rafael Costa",
    author_role: "Neurociência do Sono",
    read_time: "11 min",
    published_at: "1 Mai 2026",
    featured: false,
  },
  {
    slug: "rotina-matinal-energia",
    title: "A rotina matinal ideal para mais energia",
    excerpt:
      "5 hábitos matinais com respaldo científico para começar o dia com clareza e vigor.",
    content: [
      "Exposição solar nos primeiros 30 minutos, hidratação, movimento leve e proteína no café da manhã são os pilares.",
      "Evite celular e cafeína imediata — dê ao corpo tempo para ativar o ritmo circadiano naturalmente.",
    ],
    category: "energia",
    category_label: "Energia",
    author: "Prof. André Lima",
    author_role: "Fisiologia do Exercício",
    read_time: "5 min",
    published_at: "26 Abr 2026",
    featured: false,
  },
];

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

const lines = [
  "-- =============================================================================",
  "-- Saúde & Bem — Seed de conteúdo (Fase 2.5)",
  "-- Gerado por scripts/generate-content-seed.mjs",
  "-- Execute após 002_content_and_favorites.sql",
  "-- =============================================================================",
  "",
  "-- Limpa seed anterior (ids determinísticos)",
  "delete from public.favorites where content_id in (",
  "  select id from public.articles where id::text like 'a1000001-%'",
  "  union select id from public.protocols where id::text like 'b2000002-%'",
  "  union select id from public.ebooks where id::text like 'c3000003-%'",
  ");",
  "delete from public.articles where id::text like 'a1000001-%';",
  "delete from public.protocols where id::text like 'b2000002-%';",
  "delete from public.ebooks where id::text like 'c3000003-%';",
  "",
];

lines.push("-- Articles");
for (let i = 0; i < articles.length; i++) {
  const a = articles[i];
  lines.push(
    `insert into public.articles (id, slug, title, excerpt, content, category, category_label, author, author_role, read_time, published_at, featured, status) values (` +
      `${sqlStr(articleIds[i])}, ${sqlStr(a.slug)}, ${sqlStr(a.title)}, ${sqlStr(a.excerpt)}, ${sqlJson(a.content)}, ` +
      `${sqlStr(a.category)}, ${sqlStr(a.category_label)}, ${sqlStr(a.author)}, ${sqlStr(a.author_role)}, ` +
      `${sqlStr(a.read_time)}, ${sqlStr(a.published_at)}, ${a.featured}, 'published');`,
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

lines.push("", "-- Ebooks");
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

const outPath = join(root, "supabase", "migrations", "003_seed_content.sql");
writeFileSync(outPath, lines.join("\n") + "\n", "utf8");
console.log(`Seed gerado: ${outPath}`);
