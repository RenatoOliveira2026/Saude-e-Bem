import type { EmailContactInput, EmailContactResult } from "../types";

/** Provedor futuro — use BREVO_API_KEY como principal. */
export async function mailerLiteAddContact(
  _input: EmailContactInput,
): Promise<EmailContactResult> {
  const apiKey = process.env.MAILERLITE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("MAILERLITE_API_KEY não configurada.");
  }
  throw new Error("MailerLite reservado para fase futura — configure BREVO_API_KEY.");
}
