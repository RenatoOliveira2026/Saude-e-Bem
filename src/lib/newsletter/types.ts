/** Origem da captura do lead / newsletter */
export type NewsletterSource =
  | "home"
  | "blog"
  | "biblioteca"
  | "protocolos"
  | "footer"
  | "popup"
  | "guia-30-dias"
  | "clube"
  | "other";

export type NewsletterConversionEvent = "newsletter_signup" | "lead_magnet_download";

export type NewsletterSubscriberStatus = "active" | "unsubscribed" | "bounced";

export type NewsletterProviderId = "brevo" | "mailerlite";

export interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: NewsletterSource;
  status: NewsletterSubscriberStatus;
  provider: NewsletterProviderId | null;
  external_id: string | null;
  synced_at: string | null;
  sync_error: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscribeInput {
  name: string;
  email: string;
  phone?: string | null;
  source: NewsletterSource;
}

export type NewsletterSyncResult =
  | { ok: true; provider: NewsletterProviderId; externalId: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped: false; error: string };
