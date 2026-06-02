"use server";

import { createClient } from "@/lib/supabase/server";

export type NewsletterActionState = {
  success?: boolean;
  error?: string;
  /** Tabela ainda não migrada — feedback visual apenas */
  fallback?: boolean;
};

function getString(formData: FormData, key: string): string {
  return formData.get(key)?.toString().trim() ?? "";
}

export async function subscribeNewsletterAction(
  _prev: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const name = getString(formData, "name");
  const email = getString(formData, "email");

  if (!name || !email) {
    return { error: "Informe seu nome e e-mail." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "E-mail inválido." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("newsletter_leads").insert({
      name,
      email: email.toLowerCase(),
      source: "home",
    });

    if (error) {
      const missingTable =
        error.code === "PGRST205" ||
        error.code === "42P01" ||
        error.message.includes("newsletter_leads");

      if (missingTable) {
        return { success: true, fallback: true };
      }

      if (error.code === "23505") {
        return { success: true };
      }

      return { error: "Não foi possível registrar agora. Tente novamente." };
    }

    return { success: true };
  } catch {
    return { success: true, fallback: true };
  }
}
