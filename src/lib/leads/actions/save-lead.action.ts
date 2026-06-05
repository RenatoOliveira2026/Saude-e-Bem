"use server";

import { trackEvent } from "@/lib/analytics/track-event";
import { parseLeadSource } from "@/lib/leads/lead.constants";
import { LEAD_MESSAGES } from "@/lib/leads/lead.types";
import type { LeadSource } from "@/lib/leads/lead.types";
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

function thankYouUrl(source: LeadSource, existing: boolean, interest: string): string {
  const params = new URLSearchParams({ source, type: "lead" });
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
};

export async function saveLeadAction(
  _prev: LeadCaptureActionState,
  formData: FormData,
): Promise<LeadCaptureActionState> {
  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const interest = getString(formData, "interest");
  const source = parseLeadSource(getString(formData, "source") || "home");

  const nameError = validateLeadName(name);
  if (nameError) return { error: nameError };

  const emailError = validateLeadEmail(email);
  if (emailError) return { error: emailError };

  const interestError = validateLeadInterest(interest);
  if (interestError) return { error: interestError };

  const normalizedEmail = normalizeLeadEmail(email);
  const supabase = await createClient();

  const { error } = await supabase.from("newsletter_leads").insert({
    name: name.trim(),
    email: normalizedEmail,
    source,
    interest,
  });

  if (error) {
    if (error.code === "23505") {
      redirect(thankYouUrl(source, true, interest));
    }

    if (isLeadTableMissingError(error)) {
      return {
        error:
          "Cadastro temporariamente indisponível. Execute a migration 023 no Supabase.",
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

  void trackEvent({
    eventType: "lead_submitted",
    sourcePage: sourcePages[source],
    sourceType: source,
    metadata: { source, interest },
  });

  redirect(thankYouUrl(source, false, interest));
}
