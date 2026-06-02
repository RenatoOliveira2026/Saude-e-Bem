"use server";

import { parseNewsletterSource } from "@/lib/newsletter/sources";
import { syncToExternalProvider } from "@/lib/newsletter/providers";
import type { NewsletterSource } from "@/lib/newsletter/types";
import {
  isNewsletterPermissionError,
  isNewsletterTableMissingError,
} from "@/lib/newsletter/errors";
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

function logNewsletterError(context: string, error: { code?: string; message?: string }) {
  if (process.env.NODE_ENV === "development") {
    console.error(`[newsletter:${context}]`, {
      code: error.code ?? null,
      message: error.message ?? null,
    });
  }
}

/** Sync externo opcional — atualização via service role quando disponível */
async function tryExternalSync(
  name: string,
  email: string,
  source: NewsletterSource,
): Promise<void> {
  const result = await syncToExternalProvider({ name, email, source });
  if (!result.ok) return;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceKey) return;

  const { createClient } = await import("@supabase/supabase-js");
  const { getSupabaseEnv } = await import("@/lib/supabase/config");
  const { url } = getSupabaseEnv();

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await admin
    .from("newsletter_subscribers")
    .update({
      provider: result.provider,
      external_id: result.externalId,
      synced_at: new Date().toISOString(),
      sync_error: null,
    })
    .eq("email", email);
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

  // Sem .select() — anon pode INSERT, mas SELECT na linha exige is_admin() (RLS)
  const { error } = await supabase.from("newsletter_subscribers").insert({
    name: name.trim(),
    email: normalizedEmail,
    source,
    status: "active",
  });

  if (error) {
    logNewsletterError("subscribe", error);

    if (error.code === "23505") {
      redirect(thankYouUrl(source, true));
    }

    if (isNewsletterTableMissingError(error)) {
      return {
        error:
          "Cadastro temporariamente indisponível. Execute a migration 012 no Supabase.",
      };
    }

    if (isNewsletterPermissionError(error)) {
      return {
        error:
          "Não foi possível concluir o cadastro por permissão no banco. Verifique as políticas RLS da tabela newsletter_subscribers.",
      };
    }

    return { error: "Não foi possível registrar agora. Tente novamente." };
  }

  void tryExternalSync(name.trim(), normalizedEmail, source);

  redirect(thankYouUrl(source, false));
}
