/** Builder — Fase 7.1B Protocolos Premium */

/** UUIDs válidos (hex only) — Fase 7.1B */
export const PREMIUM_PROTOCOL_ID_PREFIX = "71000002-0002-4002-8002";
export const PREMIUM_LIBRARY_ID_PREFIX = "71000004-0004-4004-8004";

export function premiumProtocolId(index) {
  return `${PREMIUM_PROTOCOL_ID_PREFIX}-${String(index + 1).padStart(12, "0")}`;
}

export function premiumLibraryItemId(index) {
  return `${PREMIUM_LIBRARY_ID_PREFIX}-${String(index + 1).padStart(12, "0")}`;
}

export const PROTOCOL_COVERS = {
  sono: "/blog/categories/sono.svg",
  energia: "/logo-saude-bem.png",
  "controle-estresse": "/logo-saude-bem.png",
  intestinal: "/logo-saude-bem.png",
  "bem-estar-geral": "/logo-saude-bem.png",
  nutricao: "/blog/categories/hidratacao.svg",
  exercicios: "/logo-saude-bem.png",
  mente: "/logo-saude-bem.png",
  "alimentacao-saudavel": "/blog/categories/emagrecimento.svg",
  longevidade: "/blog/categories/longevidade.svg",
};

const CLUB_CTA_HTML =
  '<p>Este protocolo faz parte do <strong>Clube Saúde &amp; Bem Premium</strong>. Assine para acessar o passo a passo completo, checklist imprimível e acompanhamento na sua jornada.</p><p><a href="/clube">Conhecer o Clube Premium</a> · <a href="/assinar">Ver planos</a></p>';

export function buildProtocolContent(def) {
  const cover = PROTOCOL_COVERS[def.category] ?? "/logo-saude-bem.png";
  return [
    { type: "image", url: cover, alt: `Capa: ${def.title}` },
    { type: "heading", level: 2, text: "Objetivo" },
    { type: "paragraph", text: def.objective },
    { type: "heading", level: 2, text: "Duração" },
    {
      type: "paragraph",
      text: `${def.duration} · Nível ${def.level}. Siga o roteiro diário com constância; ajustes finos são esperados conforme sua rotina.`,
    },
    { type: "heading", level: 2, text: "Passo a passo diário" },
    { type: "list", items: def.dailySteps, ordered: true },
    { type: "heading", level: 2, text: "Checklist diária" },
    { type: "list", items: def.checklist },
    { type: "heading", level: 2, text: "Benefícios esperados" },
    { type: "list", items: def.benefits },
    { type: "heading", level: 2, text: "Continue no Clube Premium" },
    { type: "paragraph", html: CLUB_CTA_HTML },
  ];
}

export function seoForProtocol(slug, title, description, category) {
  const keywords = [
    ...slug.split("-"),
    category.replace(/-/g, " "),
    "protocolo",
    "premium",
    "saúde e bem",
  ].join(", ");
  const cover = PROTOCOL_COVERS[category] ?? "/logo-saude-bem.png";
  return {
    seo_title: `${title} | Protocolo Premium Saúde & Bem`,
    seo_description: description.slice(0, 160),
    seo_keywords: keywords,
    og_image_url: cover,
    cover_image_url: cover,
  };
}

export function enrichProtocol(def, index) {
  const content = buildProtocolContent(def);
  const seo = seoForProtocol(def.slug, def.title, def.description, def.category);
  return {
    ...def,
    category_label: def.category_label,
    is_premium: true,
    featured: def.featured ?? index < 3,
    tag: def.tag ?? "Premium",
    status: "published",
    participants: def.participants ?? 420 + index * 37,
    steps: def.phases,
    content,
    ...seo,
  };
}

export function enrichLibraryItem(protocol, index) {
  return {
    id: premiumLibraryItemId(index),
    slug: protocol.slug,
    title: protocol.title,
    description: protocol.description,
    long_description: protocol.long_description ?? protocol.longDescription,
    category: protocol.category,
    category_label: protocol.category_label,
    item_type: "protocolo",
    tier: "premium",
    is_premium: true,
    image_url: protocol.cover_image_url,
    estimated_read_time: protocol.duration,
    featured: protocol.featured,
    assets: { protocolSlug: protocol.slug },
    seo_title: `${protocol.title} | Biblioteca Saúde & Bem`,
    seo_description: protocol.description,
    seo_keywords: protocol.seo_keywords,
    og_image_url: protocol.og_image_url,
    status: "published",
  };
}
