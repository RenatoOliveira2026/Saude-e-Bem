const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeNewsletterEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateNewsletterEmail(email: string): string | null {
  const normalized = normalizeNewsletterEmail(email);
  if (!normalized) return "Informe seu e-mail.";
  if (!EMAIL_PATTERN.test(normalized)) return "E-mail inválido.";
  return null;
}

export function validateNewsletterName(name: string): string | null {
  if (!name.trim()) return "Informe seu nome.";
  if (name.trim().length < 2) return "Nome muito curto.";
  return null;
}
