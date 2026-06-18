"use client";

import {
  sendGa4GuideDownload,
  sendGa4LeadMagnetDownload,
  sendGa4NewsletterSignup,
} from "@/lib/analytics/gtag";
import { parseNewsletterSource } from "@/lib/newsletter/sources";
import type { NewsletterConversionEvent } from "@/lib/newsletter/types";
import { useEffect } from "react";

interface NewsletterConversionTrackerProps {
  source?: string;
  event?: string;
  existing?: boolean;
}

/** Dispara eventos GA4 newsletter_signup / lead_magnet_download uma vez por cadastro. */
export function NewsletterConversionTracker({
  source,
  event,
  existing,
}: NewsletterConversionTrackerProps) {
  useEffect(() => {
    const dedupeKey = `ga4_newsletter:${window.location.search}`;
    if (sessionStorage.getItem(dedupeKey)) return;

    const parsedSource = parseNewsletterSource(source ?? "other");
    const sourcePage = `${window.location.pathname}${window.location.search}`;
    const conversionEvent: NewsletterConversionEvent =
      event === "lead_magnet_download" ? "lead_magnet_download" : "newsletter_signup";

    const payload = {
      sourcePage,
      source: parsedSource,
      existing,
    };

    if (conversionEvent === "lead_magnet_download") {
      sendGa4LeadMagnetDownload(payload);
      sendGa4GuideDownload(payload);
    } else {
      sendGa4NewsletterSignup(payload);
    }

    sessionStorage.setItem(dedupeKey, "1");
  }, [source, event, existing]);

  return null;
}
