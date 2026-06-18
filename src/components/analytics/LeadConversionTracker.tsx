"use client";

import {
  sendGa4GenerateLead,
  sendGa4LaunchLead,
  sendGa4VipListSignup,
} from "@/lib/analytics/gtag";
import { useEffect } from "react";

interface LeadConversionTrackerProps {
  source?: string;
  interest?: string;
  score?: string;
  existing?: boolean;
}

/** Dispara conversões GA4 no /obrigado?type=lead — inclui eventos de lançamento (Fase 7.0). */
export function LeadConversionTracker({
  source,
  interest,
  score,
  existing,
}: LeadConversionTrackerProps) {
  useEffect(() => {
    const dedupeKey = `ga4_generate_lead:${window.location.search}`;
    if (sessionStorage.getItem(dedupeKey)) return;

    const sourcePage = window.location.pathname;

    sendGa4GenerateLead({
      source,
      interest,
      leadScore: score,
      existing,
    });

    if (source === "lista-vip-lancamento") {
      sendGa4LaunchLead({ sourcePage, source });
      sendGa4VipListSignup({ sourcePage, existing });
    }

    sessionStorage.setItem(dedupeKey, "1");
  }, [source, interest, score, existing]);

  return null;
}
