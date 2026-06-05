import { isLeadInterestId } from "./lead.constants";

export function validateLeadName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return "Informe seu nome (mínimo 2 caracteres).";
  }
  if (trimmed.length > 120) {
    return "Nome muito longo.";
  }
  return null;
}

export function validateLeadEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return "Informe seu e-mail.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "E-mail inválido.";
  }
  return null;
}

export function normalizeLeadEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateLeadInterest(interest: string): string | null {
  if (!interest) return "Selecione seu interesse principal.";
  if (!isLeadInterestId(interest)) return "Interesse inválido.";
  return null;
}

export function isLeadTableMissingError(error: { message?: string }): boolean {
  const message = error.message?.toLowerCase() ?? "";
  return (
    message.includes('relation "public.newsletter_leads" does not exist') ||
    message.includes("newsletter_leads")
  );
}

export function isLeadPermissionError(error: { code?: string; message?: string }): boolean {
  return error.code === "42501" || (error.message?.toLowerCase().includes("permission") ?? false);
}
