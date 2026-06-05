"use server";

import { triggerLeadAutomation } from "@/lib/email-automation";
import { trackEvent } from "@/lib/analytics/track-event";
import { parseLeadSource } from "@/lib/leads/lead.constants";
import { computeLeadScore, type LeadScoreId } from "@/lib/leads/lead-score";
import { LEAD_MESSAGES } from "@/lib/leads/lead.types";
import type { LeadInterestId, LeadSource } from "@/lib/leads/lead.types";
import {
  isLeadPermissionError,
  isLeadTableMissingError,
  normalizeLeadEmail,
  validateLeadEmail,
  validateLeadInterest,
  validateLeadName,
} from "@/lib/leads/lead.validate";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type LeadCaptureActionState = {
  error?: string;
};

function getString(formData: FormData, key: string): string {
  return formData.get(key)?.toString().trim() ?? "";
}

function thankYouUrl(
  source: LeadSource,
  existing: boolean,
  interest: string,
  score: string,
): string {
  const params = new URLSearchParams({ source, type: "lead", score });
  if (interest) params.set("interest", interest);
  if (existing) params.set("existing", "1");
  return `${routes.obrigado}?${params.toString()}`;
}

const sourcePages: Record<LeadSource, string> = {
  home: routes.home,
  blog: routes.blog,
  biblioteca: routes.biblioteca,
  assinar: routes.assinar,
  "minha-saude": routes.minhaSaude,
  other: routes.home,
  "lp-hidratacao": routes.lpHidratacao,
  "lp-emagrecimento": routes.lpEmagrecimento,
  "lp-longevidade": routes.lpLongevidade,
  "lp-sono": routes.lpSono,
  artigo: routes.blog,
  protocolo: routes.protocolos,
};

function buildContentContext(formData: FormData) {
  const contentType = getString(formData, "content_type");
  const contentSlug = getString(formData, "content_slug");
  const contentTitle = getString(formData, "content_title");
  const lpSlug = getString(formData, "lp_slug");

  if (!contentType && !contentSlug && !contentTitle && !lpSlug) {
    return {};
  }

  return {
    ...(contentType ? { content_type: contentType } : {}),
    ...(contentSlug ? { content_slug: contentSlug } : {}),
    ...(contentTitle ? { content_title: contentTitle } : {}),
    ...(lpSlug ? { lp_slug: lpSlug } : {}),
  };
}

export async function saveLeadAction(
  _prev: LeadCaptureActionState,
  formData: FormData,
): Promise<LeadCaptureActionState> {
  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const interest = getString(formData, "interest");
  const source = parseLeadSource(getString(formData, "source") || "home");
  const contentContext = buildContentContext(formData);
  const hasContentContext = Object.keys(contentContext).length > 0;

  const nameError = validateLeadName(name);
  if (nameError) return { error: nameError };

  const emailError = validateLeadEmail(email);
  if (emailError) return { error: emailError };

  const interestError = validateLeadInterest(interest);
  if (interestError) return { error: interestError };

  const leadScore = computeLeadScore({
    source,
    interest: interest as LeadInterestId,
    hasContentContext,
  });
  const normalizedEmail = normalizeLeadEmail(email);
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("capture_newsletter_lead", {
    p_name: name.trim(),
    p_email: normalizedEmail,
    p_source: source,
    p_interest: interest,
    p_lead_score: leadScore,
    p_content_context: contentContext,
  });

  if (error) {
    if (isLeadTableMissingError(error)) {
      return {
        error:
          "Cadastro temporariamente indisponível. Execute as migrations 023, 027 e 028 no Supabase.",
      };
    }

    if (isLeadPermissionError(error)) {
      return { error: LEAD_MESSAGES.error };
    }

    if (process.env.NODE_ENV === "development") {
      console.error("[leads:save]", error);
    }

    return { error: LEAD_MESSAGES.error };
  }

  const row = Array.isArray(data) ? data[0] : data;
  const leadId = row?.lead_id as string | undefined;
  const isExisting = Boolean(row?.is_existing);
  const finalScore = ((row?.final_score as LeadScoreId) ?? leadScore) as LeadScoreId;
  const previousScore = (row?.previous_score as string | null) ?? null;

  void trackEvent({
    eventType: "lead_submitted",
    sourcePage: sourcePages[source] ?? routes.home,
    sourceType: source,
    metadata: {
      source,
      interest,
      leadScore: finalScore,
      ...contentContext,
    },
  });

  if (leadId) {
    void triggerLeadAutomation({
      leadId,
      email: normalizedEmail,
      name: name.trim(),
      source,
      interest: interest as LeadInterestId,
      leadScore: finalScore,
      contentContext,
      isExisting,
      previousScore,
    });
  }

  redirect(thankYouUrl(source, isExisting, interest, finalScore));
}
