/** Origem da captura de lead (Fase 4.8 / 5.2). */
export type LeadSource =
  | "home"
  | "blog"
  | "biblioteca"
  | "assinar"
  | "minha-saude"
  | "other"
  | "lp-hidratacao"
  | "lp-emagrecimento"
  | "lp-longevidade"
  | "lp-sono"
  | "artigo"
  | "protocolo"
  | "lista-vip-lancamento";

export type LeadInterestId =
  | "hidratacao"
  | "emagrecimento"
  | "sono"
  | "energia"
  | "longevidade"
  | "saude-cardiovascular"
  | "bem-estar-geral";

export interface LeadInterestOption {
  id: LeadInterestId;
  label: string;
}

export interface LeadContentContext {
  content_type?: string;
  content_slug?: string;
  content_title?: string;
  lp_slug?: string;
}

export interface LeadCaptureInput {
  name: string;
  email: string;
  source: LeadSource;
  interest: LeadInterestId;
  contentContext?: LeadContentContext;
}

export const LEAD_MESSAGES = {
  success: "Cadastro realizado com sucesso",
  existing: "E-mail já cadastrado",
  error: "Erro ao cadastrar",
} as const;
