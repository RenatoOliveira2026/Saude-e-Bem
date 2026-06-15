/**
 * Aplica e valida seed Fase 5.5 (10 ofertas marketplace)
 * Uso: node scripts/verify-marketplace-seed.mjs
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !key) {
  console.error("FAIL: SUPABASE_SERVICE_ROLE_KEY necessária");
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SEED_IDS = [
  "f0550005-0005-4005-8005-000000000001",
  "f0550005-0005-4005-8005-000000000002",
  "f0550005-0005-4005-8005-000000000003",
  "f0550005-0005-4005-8005-000000000004",
  "f0550005-0005-4005-8005-000000000005",
  "f0550005-0005-4005-8005-000000000006",
  "f0550005-0005-4005-8005-000000000007",
  "f0550005-0005-4005-8005-000000000008",
  "f0550005-0005-4005-8005-000000000009",
  "f0550005-0005-4005-8005-000000000010",
];

const PRODUCTS = [
  {
    id: SEED_IDS[0],
    title: "Hábitos Atômicos",
    slug: "habitos-atomicos",
    category: "livros",
    short_description: "Guia prático para construir hábitos duradouros com micro-mudanças diárias.",
    description:
      "Best-seller de James Clear sobre como pequenas rotinas geram resultados consistentes em saúde, produtividade e bem-estar. Ideal para quem quer transformar comportamentos sem depender de motivação.",
    url: "https://example.com/affiliate/habitos-atomicos",
    affiliate_url: "https://example.com/affiliate/habitos-atomicos",
    image_url: "/logo-saude-bem.png",
    product_type: "livro",
    brand: "James Clear",
    producer_name: "Alta Books",
    affiliate_platform: "amazon",
    benefits:
      "Aprenda o método dos 1% de melhoria diária\nEstrutura clara para criar e manter hábitos\nAplicável a sono, alimentação e exercícios\nLinguagem acessível e baseada em ciência",
    target_audience: "Quem deseja criar rotinas saudáveis de forma sustentável.",
    current_price: 49.9,
    featured: true,
    editor_choice: true,
    active: true,
    seo_title: "Hábitos Atômicos | Recursos Saúde & Bem",
    seo_description: "Livro prático para construir hábitos duradouros com micro-mudanças diárias.",
    seo_keywords: "livros,habitos,rotina,bem-estar",
  },
  {
    id: SEED_IDS[1],
    title: "O Poder do Hábito",
    slug: "o-poder-do-habito",
    category: "livros",
    short_description: "Entenda a ciência por trás dos hábitos e como reprogramar comportamentos.",
    description:
      "Obra clássica de Charles Duhigg que explica o loop do hábito (deixa, rotina, recompensa) e como aplicá-lo na vida real para melhorar saúde e qualidade de vida.",
    url: "https://example.com/affiliate/o-poder-do-habito",
    affiliate_url: "https://example.com/affiliate/o-poder-do-habito",
    image_url: "/logo-saude-bem.png",
    product_type: "livro",
    brand: "Charles Duhigg",
    producer_name: "Objetiva",
    affiliate_platform: "amazon",
    benefits:
      "Framework do loop do hábito\nExemplos reais de transformação\nAplicação em saúde e comportamento\nReferência em psicologia aplicada",
    target_audience: "Leitores que querem entender o mecanismo dos hábitos antes de mudá-los.",
    current_price: 44.9,
    featured: false,
    editor_choice: false,
    active: true,
    seo_title: "O Poder do Hábito | Recursos Saúde & Bem",
    seo_description: "Ciência por trás dos hábitos e como reprogramar comportamentos.",
    seo_keywords: "livros,habitos,comportamento",
  },
  {
    id: SEED_IDS[2],
    title: "Magnésio Glicinato para Sono",
    slug: "magnesio-glicinato-sono",
    category: "sono",
    short_description: "Suplemento de magnésio glicinato para relaxamento noturno e qualidade do sono.",
    description:
      "Formulação de magnésio glicinato com alta biodisponibilidade, indicada para apoiar relaxamento muscular e transição para o sono. Complemento à higiene do sono, não substitui orientação médica.",
    url: "https://example.com/affiliate/magnesio-glicinato-sono",
    affiliate_url: "https://example.com/affiliate/magnesio-glicinato-sono",
    image_url: "/logo-saude-bem.png",
    product_type: "suplemento",
    brand: "Saúde & Bem",
    producer_name: "Essential Nutrition",
    affiliate_platform: "hotmart",
    benefits:
      "Magnésio glicinato de alta absorção\nApoio ao relaxamento noturno\nUso simples antes de dormir\nComplemento à rotina de sono",
    target_audience: "Adultos com dificuldade leve de relaxamento noturno (consulte seu médico).",
    current_price: 79.9,
    installments: "3x de R$ 26,63",
    featured: true,
    editor_choice: false,
    active: true,
    seo_title: "Magnésio Glicinato para Sono | Saúde & Bem",
    seo_description: "Suplemento para apoiar relaxamento noturno e qualidade do sono.",
    seo_keywords: "sono,suplemento,magnesio",
  },
  {
    id: SEED_IDS[3],
    title: "Travesseiro Ergonômico Cervical",
    slug: "travesseiro-ergonomico-cervical",
    category: "sono",
    short_description: "Travesseiro anatômico para alinhamento cervical e conforto durante a noite.",
    description:
      "Travesseiro ergonômico com suporte cervical, indicado para quem busca melhorar postura durante o sono e reduzir desconfortos matinais. Espuma de alta densidade com capa respirável.",
    url: "https://example.com/affiliate/travesseiro-ergonomico-cervical",
    affiliate_url: "https://example.com/affiliate/travesseiro-ergonomico-cervical",
    image_url: "/logo-saude-bem.png",
    product_type: "dispositivo",
    brand: "SleepWell",
    producer_name: "SleepWell Brasil",
    affiliate_platform: "amazon",
    benefits:
      "Suporte cervical anatômico\nEspuma de alta densidade\nCapa lavável e respirável\nMelhora conforto noturno",
    target_audience: "Pessoas que acordam com rigidez cervical ou buscam mais conforto no sono.",
    current_price: 189,
    installments: "6x sem juros",
    featured: false,
    editor_choice: false,
    active: true,
    seo_title: "Travesseiro Ergonômico Cervical | Saúde & Bem",
    seo_description: "Travesseiro anatômico para alinhamento cervical e conforto noturno.",
    seo_keywords: "sono,travesseiro,ergonomia",
  },
  {
    id: SEED_IDS[4],
    title: "Kit Faixas de Resistência Pro",
    slug: "kit-faixas-resistencia-pro",
    category: "exercicios",
    short_description: "Kit com 5 níveis de resistência para treino funcional em casa ou viagem.",
    description:
      "Conjunto de faixas elásticas com diferentes tensões, ideal para fortalecimento, mobilidade e reabilitação leve. Inclui bolsa de transporte e guia de exercícios básicos.",
    url: "https://example.com/affiliate/kit-faixas-resistencia-pro",
    affiliate_url: "https://example.com/affiliate/kit-faixas-resistencia-pro",
    image_url: "/logo-saude-bem.png",
    product_type: "dispositivo",
    brand: "MoveFit",
    producer_name: "MoveFit",
    affiliate_platform: "amazon",
    benefits:
      "5 níveis de resistência\nTreino funcional em qualquer lugar\nLeve e portátil\nGuia de exercícios incluso",
    target_audience: "Iniciantes e intermediários que treinam em casa.",
    current_price: 89.9,
    featured: false,
    editor_choice: false,
    active: true,
    seo_title: "Kit Faixas de Resistência Pro | Saúde & Bem",
    seo_description: "Faixas elásticas para treino funcional em casa ou viagem.",
    seo_keywords: "exercicios,treino,funcional",
  },
  {
    id: SEED_IDS[5],
    title: "Tapete de Yoga Antiderrapante",
    slug: "tapete-yoga-antiderrapante",
    category: "exercicios",
    short_description: "Tapete extra grosso com grip superior para yoga, pilates e alongamento.",
    description:
      "Tapete de yoga 6mm com base antiderrapante, indicado para práticas diárias de mobilidade, alongamento e exercícios de baixo impacto. Material ecológico e fácil de limpar.",
    url: "https://example.com/affiliate/tapete-yoga-antiderrapante",
    affiliate_url: "https://example.com/affiliate/tapete-yoga-antiderrapante",
    image_url: "/logo-saude-bem.png",
    product_type: "dispositivo",
    brand: "ZenMat",
    producer_name: "ZenMat",
    affiliate_platform: "amazon",
    benefits:
      "Base antiderrapante estável\nEspessura confortável (6mm)\nIndicado para yoga e pilates\nMaterial resistente e durável",
    target_audience: "Praticantes de yoga, pilates e alongamento em casa.",
    current_price: 129,
    installments: "4x de R$ 32,25",
    featured: false,
    editor_choice: false,
    active: true,
    seo_title: "Tapete de Yoga Antiderrapante | Saúde & Bem",
    seo_description: "Tapete extra grosso para yoga, pilates e alongamento.",
    seo_keywords: "exercicios,yoga,pilates",
  },
  {
    id: SEED_IDS[6],
    title: "Oxímetro de Pulso Digital",
    slug: "oximetro-pulso-digital",
    category: "equipamentos-saude",
    short_description: "Monitor portátil de saturação e frequência cardíaca para uso doméstico.",
    description:
      "Oxímetro de dedo com display LED, leitura rápida de SpO2 e batimentos. Útil para monitoramento doméstico complementar — não substitui avaliação médica.",
    url: "https://example.com/affiliate/oximetro-pulso-digital",
    affiliate_url: "https://example.com/affiliate/oximetro-pulso-digital",
    image_url: "/logo-saude-bem.png",
    product_type: "dispositivo",
    brand: "HealthTrack",
    producer_name: "HealthTrack",
    affiliate_platform: "amazon",
    benefits:
      "Leitura de SpO2 e BPM\nDisplay claro e portátil\nUso doméstico complementar\nLigamento automático",
    target_audience: "Adultos que desejam acompanhar saturação em casa (sob orientação profissional).",
    current_price: 69.9,
    featured: false,
    editor_choice: false,
    active: true,
    seo_title: "Oxímetro de Pulso Digital | Saúde & Bem",
    seo_description: "Monitor portátil de saturação e frequência cardíaca.",
    seo_keywords: "saude,oximetro,monitoramento",
  },
  {
    id: SEED_IDS[7],
    title: "Balança Inteligente Bioimpedância",
    slug: "balanca-inteligente-bioimpedancia",
    category: "equipamentos-saude",
    short_description: "Balança com análise de composição corporal via app Bluetooth.",
    description:
      "Balança inteligente com bioimpedância, sincronização via app para acompanhar peso, gordura corporal e hidratação. Ferramenta de autoconhecimento — não substitui avaliação clínica.",
    url: "https://example.com/affiliate/balanca-inteligente-bioimpedancia",
    affiliate_url: "https://example.com/affiliate/balanca-inteligente-bioimpedancia",
    image_url: "/logo-saude-bem.png",
    product_type: "dispositivo",
    brand: "FitScale",
    producer_name: "FitScale",
    affiliate_platform: "amazon",
    benefits:
      "Análise de composição corporal\nSincronização via app\nHistórico de evolução\nDesign slim e moderno",
    target_audience: "Quem acompanha evolução de peso e composição corporal.",
    current_price: 199,
    installments: "5x sem juros",
    featured: false,
    editor_choice: false,
    active: true,
    seo_title: "Balança Inteligente Bioimpedância | Saúde & Bem",
    seo_description: "Balança com análise de composição corporal via app.",
    seo_keywords: "saude,balança,composicao-corporal",
  },
  {
    id: SEED_IDS[8],
    title: "Difusor Aromaterapia Ultrassônico",
    slug: "difusor-aromaterapia-ultrassonico",
    category: "bem-estar",
    short_description: "Difusor ultrassônico silencioso para ambientes de relaxamento e meditação.",
    description:
      "Difusor de aromaterapia com nebulização ultrassônica, luz suave e timer automático. Ideal para criar ambiente de calma em quarto, sala ou espaço de meditação.",
    url: "https://example.com/affiliate/difusor-aromaterapia-ultrassonico",
    affiliate_url: "https://example.com/affiliate/difusor-aromaterapia-ultrassonico",
    image_url: "/logo-saude-bem.png",
    product_type: "dispositivo",
    brand: "CalmHome",
    producer_name: "CalmHome",
    affiliate_platform: "amazon",
    benefits:
      "Nebulização ultrassônica silenciosa\nTimer automático\nLuz ambiente suave\nAmbiente de relaxamento",
    target_audience: "Quem pratica meditação, yoga ou busca ambientes mais calmos.",
    current_price: 149,
    featured: true,
    editor_choice: true,
    active: true,
    seo_title: "Difusor Aromaterapia Ultrassônico | Saúde & Bem",
    seo_description: "Difusor silencioso para relaxamento e meditação.",
    seo_keywords: "bem-estar,aromaterapia,relaxamento",
  },
  {
    id: SEED_IDS[9],
    title: "Journal de Gratidão 90 Dias",
    slug: "journal-gratidao-90-dias",
    category: "bem-estar",
    short_description: "Caderno guiado de gratidão e reflexão para 90 dias de prática diária.",
    description:
      "Journal estruturado com prompts diários de gratidão, reflexão e intenções. Ferramenta simples para cultivar bem-estar emocional e consistência na prática de mindfulness.",
    url: "https://example.com/affiliate/journal-gratidao-90-dias",
    affiliate_url: "https://example.com/affiliate/journal-gratidao-90-dias",
    image_url: "/logo-saude-bem.png",
    product_type: "livro",
    brand: "Mindful Press",
    producer_name: "Mindful Press",
    affiliate_platform: "amazon",
    benefits:
      "90 dias de prompts guiados\nPrática diária de gratidão\nFormato compacto\nApoio ao bem-estar emocional",
    target_audience: "Quem busca uma prática simples de mindfulness e autoconhecimento.",
    current_price: 39.9,
    featured: false,
    editor_choice: false,
    active: true,
    seo_title: "Journal de Gratidão 90 Dias | Saúde & Bem",
    seo_description: "Caderno guiado de gratidão para 90 dias de prática.",
    seo_keywords: "bem-estar,gratidao,mindfulness",
  },
];

async function applySeed() {
  const rows = PRODUCTS.map((p) => ({ ...p, installments: p.installments ?? "" }));
  await sb.from("affiliate_links").delete().in("id", SEED_IDS);
  const { error } = await sb.from("affiliate_links").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`seed insert: ${error.message}`);
}

async function verify() {
  const { data, error } = await sb
    .from("affiliate_links")
    .select("slug, category, featured, active, short_description")
    .in("id", SEED_IDS)
    .order("slug");

  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const featured = rows.filter((r) => r.featured).length;
  const active = rows.filter((r) => r.active).length;
  const categories = new Set(rows.map((r) => r.category));

  console.log(`Produtos seed: ${rows.length}`);
  console.log(`Ativos: ${active} | Destaques: ${featured}`);
  console.log(`Categorias: ${[...categories].join(", ")}`);

  const checks = [
    rows.length === 10,
    active === 10,
    featured === 3,
    categories.has("livros"),
    categories.has("sono"),
    categories.has("exercicios"),
    categories.has("equipamentos-saude"),
    categories.has("bem-estar"),
    rows.every((r) => r.short_description?.trim()),
  ];

  if (!checks.every(Boolean)) {
    console.log("FAIL validação seed");
    process.exit(1);
  }

  console.log("OK seed validado");
}

const apply = process.argv.includes("--apply");

if (apply) {
  await applySeed();
  console.log("OK seed aplicado via API");
}

await verify();
