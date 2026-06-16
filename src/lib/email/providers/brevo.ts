import {
  getBrevoNewsletterListId,
  isBrevoLiveSyncEnabled,
  upsertBrevoContact,
} from "@/lib/brevo";
import type { EmailContactInput, EmailContactResult } from "../types";

/** Sincroniza assinante de newsletter com Brevo (provedor principal). */
export async function brevoAddContact(
  input: EmailContactInput,
): Promise<EmailContactResult> {
  if (!isBrevoLiveSyncEnabled()) {
    throw new Error(
      "Sync Brevo desativado (LEAD_ESP_LIVE_SYNC=false). Contato salvo apenas no Supabase.",
    );
  }

  const listId = getBrevoNewsletterListId();
  const result = await upsertBrevoContact({
    email: input.email,
    attributes: {
      FIRSTNAME: input.name,
      NEWSLETTER_SOURCE: input.source,
      ...(input.phone ? { SMS: input.phone } : {}),
    },
    ...(listId ? { listIds: [listId] } : {}),
  });

  return {
    externalId: result.externalId ?? input.email,
  };
}
