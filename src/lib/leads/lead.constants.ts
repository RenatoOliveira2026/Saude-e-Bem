import type { LeadInterestOption, LeadInterestId, LeadSource } from "./lead.types";

export const LEAD_INTERESTS: LeadInterestOption[] = [
  { id: "hidratacao", label: "Hidratação" },
  { id: "emagrecimento", label: "Emagrecimento" },
  { id: "sono", label: "Sono" },
  { id: "energia", label: "Energia" },
  { id: "longevidade", label: "Longevidade" },
  { id: "saude-cardiovascular", label: "Saúde cardiovascular" },
  { id: "bem-estar-geral", label: "Bem-estar geral" },
];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  home: "Home",
  blog: "Blog",
  biblioteca: "Biblioteca",
  assinar: "Assinatura",
  "minha-saude": "Minha Saúde",
  other: "Outro",
  "lp-hidratacao": "LP Hidratação",
  "lp-emagrecimento": "LP Emagrecimento",
  "lp-longevidade": "LP Longevidade",
  "lp-sono": "LP Sono",
  artigo: "Artigo",
  protocolo: "Protocolo",
  "lista-vip-lancamento": "Lista VIP — Lançamento",
};

export function isLeadSource(value: string): value is LeadSource {
  return value in LEAD_SOURCE_LABELS;
}

export function parseLeadSource(value: string): LeadSource {
  return isLeadSource(value) ? value : "other";
}

export function isLeadInterestId(value: string): value is LeadInterestId {
  return LEAD_INTERESTS.some((item) => item.id === value);
}

export function getLeadInterestLabel(id: string): string | null {
  return LEAD_INTERESTS.find((item) => item.id === id)?.label ?? null;
}
