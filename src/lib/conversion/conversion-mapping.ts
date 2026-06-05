import { landingPageForInterest } from "@/lib/conversion/landing-pages.config";
import type { LeadInterestId, LeadSource } from "@/lib/leads/lead.types";
import { routes } from "@/lib/routes";

export type ConversionContext = "article" | "protocol" | "library";

const CATEGORY_TO_INTEREST: Record<string, LeadInterestId> = {
  hidratacao: "hidratacao",
  emagrecimento: "emagrecimento",
  sono: "sono",
  longevidade: "longevidade",
  "saude-cardiovascular": "saude-cardiovascular",
  energia: "energia",
  intestinal: "bem-estar-geral",
  detox: "bem-estar-geral",
  menopausa: "bem-estar-geral",
  prevencao: "bem-estar-geral",
  cardiovascular: "saude-cardiovascular",
};

const CONTEXT_SOURCE: Record<ConversionContext, LeadSource> = {
  article: "artigo",
  protocol: "protocolo",
  library: "biblioteca",
};

export interface ConversionMapping {
  source: LeadSource;
  interest: LeadInterestId;
  landingHref: string | null;
  landingLabel: string | null;
  headline: string;
  description: string;
  submitLabel: string;
}

export function resolveCategoryInterest(category: string): LeadInterestId {
  return CATEGORY_TO_INTEREST[category] ?? "bem-estar-geral";
}

export function resolveConversionMapping(input: {
  context: ConversionContext;
  category: string;
  categoryLabel: string;
  contentTitle: string;
}): ConversionMapping {
  const interest = resolveCategoryInterest(input.category);
  const landing = landingPageForInterest(interest);
  const source = CONTEXT_SOURCE[input.context];

  const theme = input.categoryLabel.toLowerCase();

  return {
    source,
    interest,
    landingHref: landing?.path ?? null,
    landingLabel: landing?.title ?? null,
    headline: `Continue em ${theme} com conteúdos práticos`,
    description: `Você leu "${input.contentTitle}". Receba materiais sobre ${theme} no e-mail — ou conheça o guia completo.`,
    submitLabel: "Quero receber materiais gratuitos",
  };
}

export function thankYouRecommendations(interest?: string | null) {
  const resolved = interest && CATEGORY_TO_INTEREST[interest]
    ? (interest as LeadInterestId)
    : interest && ["emagrecimento", "sono", "longevidade", "hidratacao", "saude-cardiovascular", "energia", "bem-estar-geral"].includes(interest)
      ? (interest as LeadInterestId)
      : null;

  const landing = resolved ? landingPageForInterest(resolved) : null;

  const items: { label: string; href: string; description: string }[] = [
    { label: "Explorar blog", href: routes.blog, description: "Artigos gratuitos por tema" },
    { label: "Ver protocolos", href: routes.protocolos, description: "Planos práticos de 7 a 90 dias" },
  ];

  if (landing) {
    items.unshift({
      label: landing.title,
      href: landing.path,
      description: "Guia completo gratuito",
    });
  }

  items.push({
    label: "Clube Saúde & Bem",
    href: routes.assinar,
    description: "Conteúdos premium e acompanhamento",
  });

  return items;
}
