import type { EmailContactInput, EmailContactResult } from "../types";

/** Stub Brevo — conectar quando BREVO_API_KEY estiver configurada. */
export async function brevoAddContact(
  _input: EmailContactInput,
): Promise<EmailContactResult> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("BREVO_API_KEY não configurada.");
  }
  throw new Error("Integração Brevo ainda não implementada.");
}
