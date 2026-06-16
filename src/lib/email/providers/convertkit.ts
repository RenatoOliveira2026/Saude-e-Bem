import type { EmailContactInput, EmailContactResult } from "../types";

/** Provedor futuro — use BREVO_API_KEY como principal. */
export async function convertKitAddContact(
  _input: EmailContactInput,
): Promise<EmailContactResult> {
  const apiKey = process.env.CONVERTKIT_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("CONVERTKIT_API_KEY não configurada.");
  }
  throw new Error("ConvertKit reservado para fase futura — configure BREVO_API_KEY.");
}
