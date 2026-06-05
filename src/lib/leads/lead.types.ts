/** Origem da captura de lead (Fase 4.8). */
export type LeadSource =
  | "home"
  | "blog"
  | "biblioteca"
  | "assinar"
  | "minha-saude"
  | "other";

export type LeadInterestId =
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

export interface LeadCaptureInput {
  name: string;
  email: string;
  source: LeadSource;
  interest: LeadInterestId;
}

export const LEAD_MESSAGES = {
  success: "Cadastro realizado com sucesso",
  existing: "E-mail já cadastrado",
  error: "Erro ao cadastrar",
} as const;
