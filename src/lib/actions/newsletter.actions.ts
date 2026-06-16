"use server";

import { trackEvent } from "@/lib/analytics/track-event";
import { syncContactToEmailProvider } from "@/lib/email";
import { parseNewsletterSource } from "@/lib/newsletter/sources";
import type {
  NewsletterConversionEvent,
  NewsletterSource,
} from "@/lib/newsletter/types";
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
import { normalizeWhatsAppPhone } from "@/lib/whatsapp/phone";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type NewsletterActionState = {
  error?: string;
};

function getString(formData: FormData, key: string): string {
  return formData.get(key)?.toString().trim() ?? "";
}

function parseConversionEvent(value: string): NewsletterConversionEvent {
  return value === "lead_magnet_download" ? "lead_magnet_download" : "newsletter_signup";
}

function thankYouUrl(
  source: NewsletterSource,
  existing: boolean,
  conversionEvent: NewsletterConversionEvent,
): string {
  const params = new URLSearchParams({
    source,
    event: conversionEvent,
  });
  if (existing) params.set("existing", "1");
  return `${routes.obrigadoNewsletter}?${params.toString()}`;
}

function logNewsletterError(context: string, error: { code?: string; message?: string }) {
  if (process.env.NODE_ENV === "development") {
    console.error(`[newsletter:${context}]`, {
      code: error.code ?? null,
      message: error.message ?? null,
    });
  }
}

async function tryExternalSync(
  name: string,
  email: string,
  source: NewsletterSource,
  phone: string | null,
): Promise<void> {
  const result = await syncContactToEmailProvider({
    name,
    email,
    source,
    phone,
  });

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceKey) return;

  const { createClient } = await import("@supabase/supabase-js");
  const { getSupabaseEnv } = await import("@/lib/supabase/config");
  const { url } = getSupabaseEnv();

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  if (result.ok) {
    await admin
      .from("newsletter_subscribers")
      .update({
        provider: result.provider,
        external_id: result.externalId,
        synced_at: new Date().toISOString(),
        sync_error: null,
      })
      .eq("email", email);
    return;
  }

  if (!result.ok && !result.skipped) {
    await admin
      .from("newsletter_subscribers")
      .update({
        sync_error: result.error,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email);
  }
}

const sourcePages: Record<NewsletterSource, string> = {
  home: routes.home,
  blog: routes.blog,
  biblioteca: routes.biblioteca,
  protocolos: routes.protocolos,
  footer: routes.home,
  popup: routes.home,
  "guia-30-dias": routes.guia30Dias,
  clube: routes.clube,
  other: routes.home,
};

export async function subscribeNewsletterAction(
  _prev: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const phoneRaw = getString(formData, "phone");
  const source = parseNewsletterSource(getString(formData, "source") || "home");
  const conversionEvent = parseConversionEvent(getString(formData, "conversion_event"));

  const nameError = validateNewsletterName(name);
  if (nameError) return { error: nameError };

  const emailError = validateNewsletterEmail(email);
  if (emailError) return { error: emailError };

  const normalizedEmail = normalizeNewsletterEmail(email);
  const normalizedPhone = phoneRaw ? normalizeWhatsAppPhone(phoneRaw) : null;

  const supabase = await createClient();

  const { error } = await supabase.from("newsletter_subscribers").insert({
    name: name.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    source,
    status: "active",
  });

  if (error) {
    logNewsletterError("subscribe", error);

    if (error.code === "23505") {
      redirect(thankYouUrl(source, true, conversionEvent));
    }

    if (isNewsletterTableMissingError(error)) {
      return {
        error:
          "Cadastro temporariamente indisponível. Execute as migrations 012 e 032 no Supabase.",
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

  void tryExternalSync(name.trim(), normalizedEmail, source, normalizedPhone);

  void trackEvent({
    eventType: "lead_submitted",
    sourcePage: sourcePages[source],
    sourceType: source,
    metadata: {
      source,
      conversion_event: conversionEvent,
    },
  });

  redirect(thankYouUrl(source, false, conversionEvent));
}
