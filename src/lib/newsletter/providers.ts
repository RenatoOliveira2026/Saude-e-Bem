import type {
  NewsletterProviderId,
  NewsletterSubscribeInput,
  NewsletterSyncResult,
} from "@/lib/newsletter/types";
import { syncContactToEmailProvider } from "@/lib/email";

/** @deprecated Use @/lib/email — mantido para compatibilidade. */
export interface NewsletterProvider {
  id: NewsletterProviderId;
  addContact(input: NewsletterSubscribeInput): Promise<{ externalId: string }>;
}

function getConfiguredProviderId(): NewsletterProviderId | null {
  const raw = process.env.NEWSLETTER_PROVIDER?.trim().toLowerCase();
  if (raw === "brevo" || raw === "mailerlite") return raw;
  if (process.env.BREVO_API_KEY?.trim()) return "brevo";
  return null;
}

export function getNewsletterProvider(): NewsletterProvider | null {
  const id = getConfiguredProviderId();
  if (!id) return null;
  return {
    id,
    addContact: async (input) => {
      const result = await syncContactToEmailProvider(input);
      if (!result.ok) {
        throw new Error("error" in result ? result.error : result.reason);
      }
      return { externalId: result.externalId };
    },
  };
}

export function isNewsletterProviderConfigured(): boolean {
  const id = getConfiguredProviderId();
  if (!id) return false;
  if (id === "brevo") return Boolean(process.env.BREVO_API_KEY?.trim());
  if (id === "mailerlite") return Boolean(process.env.MAILERLITE_API_KEY?.trim());
  return false;
}

export async function syncToExternalProvider(
  input: NewsletterSubscribeInput,
): Promise<NewsletterSyncResult> {
  const result = await syncContactToEmailProvider(input);
  if (result.ok) {
    return {
      ok: true,
      provider: result.provider === "mailerlite" ? "mailerlite" : "brevo",
      externalId: result.externalId,
    };
  }
  return result;
}
