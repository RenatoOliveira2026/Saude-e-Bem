import type { EmailContactInput, EmailContactResult } from "../types";

/** Stub MailerLite — conectar quando MAILERLITE_API_KEY estiver configurada. */
export async function mailerLiteAddContact(
  _input: EmailContactInput,
): Promise<EmailContactResult> {
  const apiKey = process.env.MAILERLITE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("MAILERLITE_API_KEY não configurada.");
  }
  throw new Error("Integração MailerLite ainda não implementada.");
}
