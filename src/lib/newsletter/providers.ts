import type {
  NewsletterProviderId,
  NewsletterSubscribeInput,
  NewsletterSyncResult,
} from "@/lib/newsletter/types";

/** Contrato para integrações futuras (Brevo, MailerLite, etc.) */
export interface NewsletterProvider {
  id: NewsletterProviderId;
  addContact(input: NewsletterSubscribeInput): Promise<{ externalId: string }>;
}

function getConfiguredProviderId(): NewsletterProviderId | null {
  const raw = process.env.NEWSLETTER_PROVIDER?.trim().toLowerCase();
  if (raw === "brevo" || raw === "mailerlite") return raw;
  return null;
}

/** Stub Brevo — implementar quando BREVO_API_KEY estiver configurada */
async function brevoAddContact(
  _input: NewsletterSubscribeInput,
): Promise<{ externalId: string }> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("BREVO_API_KEY não configurada.");
  }
  // TODO Fase futura: POST https://api.brevo.com/v3/contacts
  throw new Error("Integração Brevo ainda não implementada.");
}

/** Stub MailerLite — implementar quando MAILERLITE_API_KEY estiver configurada */
async function mailerLiteAddContact(
  _input: NewsletterSubscribeInput,
): Promise<{ externalId: string }> {
  const apiKey = process.env.MAILERLITE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("MAILERLITE_API_KEY não configurada.");
  }
  // TODO Fase futura: POST https://connect.mailerlite.com/api/subscribers
  throw new Error("Integração MailerLite ainda não implementada.");
}

export function getNewsletterProvider(): NewsletterProvider | null {
  const id = getConfiguredProviderId();
  if (!id) return null;

  return {
    id,
    addContact:
      id === "brevo" ? brevoAddContact : mailerLiteAddContact,
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
  const provider = getNewsletterProvider();

  if (!provider) {
    return {
      ok: false,
      skipped: true,
      reason: "Nenhum provedor de newsletter configurado.",
    };
  }

  if (!isNewsletterProviderConfigured()) {
    return {
      ok: false,
      skipped: true,
      reason: `Provedor ${provider.id} selecionado, mas API key ausente.`,
    };
  }

  try {
    const { externalId } = await provider.addContact(input);
    return { ok: true, provider: provider.id, externalId };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao sincronizar contato.";
    return { ok: false, skipped: false, error: message };
  }
}
