"use client";

import { sendGa4GenerateLead } from "@/lib/analytics/gtag";
import { useEffect } from "react";

interface LeadConversionTrackerProps {
  source?: string;
  interest?: string;
  score?: string;
  existing?: boolean;
}

/** Dispara `generate_lead` no GA4 uma vez por cadastro bem-sucedido (/obrigado?type=lead). */
export function LeadConversionTracker({
  source,
  interest,
  score,
  existing,
}: LeadConversionTrackerProps) {
  useEffect(() => {
    const dedupeKey = `ga4_generate_lead:${window.location.search}`;
    if (sessionStorage.getItem(dedupeKey)) return;

    sendGa4GenerateLead({
      source,
      interest,
      leadScore: score,
      existing,
    });

    sessionStorage.setItem(dedupeKey, "1");
  }, [source, interest, score, existing]);

  return null;
}
