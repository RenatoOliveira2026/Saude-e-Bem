export type EmailProviderId = "brevo" | "mailerlite" | "convertkit";

export interface EmailContactInput {
  name: string;
  email: string;
  phone?: string | null;
  source: string;
  tags?: string[];
}

export interface EmailContactResult {
  externalId: string;
}

export interface EmailProvider {
  id: EmailProviderId;
  addContact(input: EmailContactInput): Promise<EmailContactResult>;
}

export type EmailSyncResult =
  | { ok: true; provider: EmailProviderId; externalId: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped: false; error: string };
