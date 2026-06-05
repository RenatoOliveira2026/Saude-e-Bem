import type { LeadInterestId, LeadSource } from "@/lib/leads/lead.types";
import { routes } from "@/lib/routes";

export type LandingPageSlug =
  | "lp-hidratacao"
  | "lp-emagrecimento"
  | "lp-longevidade"
  | "lp-sono";

export interface LandingPageConfig {
  slug: LandingPageSlug;
  path: string;
  source: LeadSource;
  interest: LeadInterestId;
  badge: string;
  title: string;
  subtitle: string;
  heroDescription: string;
  coverImage: string;
  benefits: string[];
  bullets: string[];
  ctaTitle: string;
  ctaDescription: string;
}

export const LANDING_PAGES: Record<LandingPageSlug, LandingPageConfig> = {
  "lp-hidratacao": {
    slug: "lp-hidratacao",
    path: routes.lpHidratacao,
    source: "lp-hidratacao",
    interest: "hidratacao",
    badge: "Guia gratuito",
    title: "Hidratação inteligente para mais energia e foco",
    subtitle: "Meta personalizada · Sinais de alerta · Rotina prática",
    heroDescription:
      "Receba o guia completo de hidratação e materiais práticos no seu e-mail — conteúdo educativo da equipe Saúde & Bem.",
    coverImage: "/blog/categories/hidratacao.svg",
    benefits: [
      "Calcule sua meta diária por peso e rotina",
      "Identifique sinais precoces de desidratação",
      "Rotina simples para manter consistência",
    ],
    bullets: [
      "Artigos sobre hidratação e cognição",
      "Ferramenta gratuita de meta diária",
      "Protocolos alinhados ao tema",
    ],
    ctaTitle: "Baixe o guia no seu e-mail",
    ctaDescription: "Cadastro gratuito. Sem spam — cancele quando quiser.",
  },
  "lp-emagrecimento": {
    slug: "lp-emagrecimento",
    path: routes.lpEmagrecimento,
    source: "lp-emagrecimento",
    interest: "emagrecimento",
    badge: "Emagrecimento sustentável",
    title: "Emagrecimento que respeita seu metabolismo",
    subtitle: "Proteína · Hábitos · Resultados duradouros",
    heroDescription:
      "Materiais práticos sobre perda de gordura sustentável — baseados em evidências, não em promessas milagrosas.",
    coverImage: "/blog/categories/emagrecimento.svg",
    benefits: [
      "Déficit calórico inteligente sem efeito rebote",
      "Estratégias para superar platôs",
      "Foco em composição corporal, não só balança",
    ],
    bullets: [
      "Artigos sobre emagrecimento e metabolismo",
      "Protocolos estruturados de 7 a 21 dias",
      "Conteúdos premium no Clube Saúde & Bem",
    ],
    ctaTitle: "Receba o plano prático no e-mail",
    ctaDescription: "Conteúdo educativo. Consulte sempre seu nutricionista ou médico.",
  },
  "lp-longevidade": {
    slug: "lp-longevidade",
    path: routes.lpLongevidade,
    source: "lp-longevidade",
    interest: "longevidade",
    badge: "Longevidade saudável",
    title: "Envelheça com vitalidade — ciência aplicada",
    subtitle: "Sono · Nutrição · Movimento · Biomarcadores",
    heroDescription:
      "Os pilares comprovados para viver mais e melhor, com materiais curados pela equipe Saúde & Bem.",
    coverImage: "/blog/categories/longevidade.svg",
    benefits: [
      "Hábitos integrados com evidência científica",
      "Biomarcadores acessíveis explicados",
      "Prevenção antes dos sintomas",
    ],
    bullets: [
      "Manual da longevidade na biblioteca",
      "Artigos sobre biomarcadores e prevenção",
      "Clube Premium com conteúdos aprofundados",
    ],
    ctaTitle: "Comece sua jornada de longevidade",
    ctaDescription: "Receba conteúdos selecionados no seu e-mail.",
  },
  "lp-sono": {
    slug: "lp-sono",
    path: routes.lpSono,
    source: "lp-sono",
    interest: "sono",
    badge: "Sono reparador",
    title: "Durma melhor e acorde com disposição",
    subtitle: "Higiene do sono · Ambiente · Rotina noturna",
    heroDescription:
      "Guia prático para noites restauradoras — sem depender de suplementos caros ou hacks duvidosos.",
    coverImage: "/blog/categories/sono.svg",
    benefits: [
      "Rotina noturna em passos simples",
      "Checklist de ambiente ideal",
      "Conexão sono, imunidade e metabolismo",
    ],
    bullets: [
      "E-book Sono Reparador na biblioteca",
      "Protocolo de 7 dias disponível",
      "Artigos sobre insônia e recuperação",
    ],
    ctaTitle: "Receba o guia de sono no e-mail",
    ctaDescription: "Material educativo gratuito para começar hoje.",
  },
};

export function getLandingPage(slug: LandingPageSlug): LandingPageConfig {
  return LANDING_PAGES[slug];
}

export function landingPageForInterest(
  interest: LeadInterestId,
): LandingPageConfig | null {
  const entry = Object.values(LANDING_PAGES).find((lp) => lp.interest === interest);
  return entry ?? null;
}
