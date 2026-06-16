/** Provedor principal de e-mail marketing e ESP de leads. */
export function getBrevoApiKey(): string | null {
  const key = process.env.BREVO_API_KEY?.trim();
  return key || null;
}

export function isBrevoConfigured(): boolean {
  return Boolean(getBrevoApiKey());
}

/**
 * Sync real com Brevo quando a API key está configurada.
 * Desative com LEAD_ESP_LIVE_SYNC=false (útil em dev local).
 */
export function isBrevoLiveSyncEnabled(): boolean {
  if (!isBrevoConfigured()) return false;
  if (process.env.LEAD_ESP_LIVE_SYNC === "false") return false;
  return true;
}

export function getBrevoNewsletterListId(): number | undefined {
  const raw = process.env.BREVO_NEWSLETTER_LIST_ID?.trim();
  if (!raw) return undefined;
  const id = Number(raw);
  return Number.isFinite(id) ? id : undefined;
}

export function getBrevoLeadsListId(): number | undefined {
  const raw = process.env.BREVO_LEADS_LIST_ID?.trim();
  if (!raw) return undefined;
  const id = Number(raw);
  return Number.isFinite(id) ? id : undefined;
}
