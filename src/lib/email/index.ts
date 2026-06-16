import { isBrevoConfigured } from "@/lib/brevo";
import { brevoAddContact } from "./providers/brevo";
import { convertKitAddContact } from "./providers/convertkit";
import { mailerLiteAddContact } from "./providers/mailerlite";
import type {
  EmailContactInput,
  EmailProvider,
  EmailProviderId,
  EmailSyncResult,
} from "./types";

export type {
  EmailContactInput,
  EmailContactResult,
  EmailProvider,
  EmailProviderId,
  EmailSyncResult,
} from "./types";

const FUTURE_PROVIDERS: EmailProviderId[] = ["mailerlite", "convertkit"];

function getConfiguredProviderId(): EmailProviderId | null {
  const raw =
    process.env.EMAIL_PROVIDER?.trim().toLowerCase() ??
    process.env.NEWSLETTER_PROVIDER?.trim().toLowerCase();

  if (raw === "brevo" || raw === "mailerlite" || raw === "convertkit") {
    return raw;
  }

  if (isBrevoConfigured()) return "brevo";

  return null;
}

export function getEmailMarketingProvider(): EmailProvider | null {
  const id = getConfiguredProviderId();
  if (!id) return null;

  const addContact =
    id === "brevo"
      ? brevoAddContact
      : id === "mailerlite"
        ? mailerLiteAddContact
        : convertKitAddContact;

  return { id, addContact };
}

export function isEmailProviderConfigured(): boolean {
  const id = getConfiguredProviderId();
  if (!id) return false;
  if (id === "brevo") return isBrevoConfigured();
  if (id === "mailerlite") return Boolean(process.env.MAILERLITE_API_KEY?.trim());
  if (id === "convertkit") return Boolean(process.env.CONVERTKIT_API_KEY?.trim());
  return false;
}

export function isFutureEmailProvider(id: EmailProviderId): boolean {
  return FUTURE_PROVIDERS.includes(id);
}

/** Sincroniza contato com Brevo (principal) ou provedor futuro configurado. */
export async function syncContactToEmailProvider(
  input: EmailContactInput,
): Promise<EmailSyncResult> {
  const provider = getEmailMarketingProvider();

  if (!provider) {
    return {
      ok: false,
      skipped: true,
      reason: "Nenhum provedor de e-mail configurado. Defina BREVO_API_KEY.",
    };
  }

  if (!isEmailProviderConfigured()) {
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
