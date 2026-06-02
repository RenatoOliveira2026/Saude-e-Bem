"use server";

import { parseNewsletterSource } from "@/lib/newsletter/sources";
import { syncToExternalProvider } from "@/lib/newsletter/providers";
import type { NewsletterSource } from "@/lib/newsletter/types";
import {
  normalizeNewsletterEmail,
  validateNewsletterEmail,
  validateNewsletterName,
} from "@/lib/newsletter/validate";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type NewsletterActionState = {
  error?: string;
};

function getString(formData: FormData, key: string): string {
  return formData.get(key)?.toString().trim() ?? "";
}

function thankYouUrl(source: NewsletterSource, existing: boolean): string {
  const params = new URLSearchParams({ source });
  if (existing) params.set("existing", "1");
  return `${routes.obrigado}?${params.toString()}`;
}

async function tryExternalSync(
  name: string,
  email: string,
  source: NewsletterSource,
  subscriberId: string,
): Promise<void> {
  const result = await syncToExternalProvider({ name, email, source });
  if (!result.ok && !result.skipped) {
    const supabase = await createClient();
    await supabase
      .from("newsletter_subscribers")
      .update({ sync_error: result.error })
      .eq("id", subscriberId);
    return;
  }

  if (result.ok) {
    const supabase = await createClient();
    await supabase
      .from("newsletter_subscribers")
      .update({
        provider: result.provider,
        external_id: result.externalId,
        synced_at: new Date().toISOString(),
        sync_error: null,
      })
      .eq("id", subscriberId);
  }
}

export async function subscribeNewsletterAction(
  _prev: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const source = parseNewsletterSource(getString(formData, "source") || "home");

  const nameError = validateNewsletterName(name);
  if (nameError) return { error: nameError };

  const emailError = validateNewsletterEmail(email);
  if (emailError) return { error: emailError };

  const normalizedEmail = normalizeNewsletterEmail(email);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .insert({
      name: name.trim(),
      email: normalizedEmail,
      source,
      status: "active",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      redirect(thankYouUrl(source, true));
    }

    const missingTable =
      error.code === "PGRST205" ||
      error.code === "42P01" ||
      error.message.includes("newsletter_subscribers");

    if (missingTable) {
      return {
        error:
          "Cadastro temporariamente indisponível. Execute a migration 012 no Supabase.",
      };
    }

    return { error: "Não foi possível registrar agora. Tente novamente." };
  }

  if (data?.id) {
    void tryExternalSync(name.trim(), normalizedEmail, source, data.id);
  }

  redirect(thankYouUrl(source, false));
}
