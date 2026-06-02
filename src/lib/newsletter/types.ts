/** Origem da captura do lead */
export type NewsletterSource = "home" | "blog" | "biblioteca" | "clube" | "other";

export type NewsletterSubscriberStatus = "active" | "unsubscribed" | "bounced";

export type NewsletterProviderId = "brevo" | "mailerlite";

export interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
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
  source: NewsletterSource;
}

export type NewsletterSyncResult =
  | { ok: true; provider: NewsletterProviderId; externalId: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped: false; error: string };
