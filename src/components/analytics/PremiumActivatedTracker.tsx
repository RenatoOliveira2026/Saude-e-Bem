"use client";

import { sendGa4PremiumActivated, sendGa4PaymentApproved } from "@/lib/analytics/growth-events";
import { useEffect, useRef } from "react";

interface PremiumActivatedTrackerProps {
  isPremium: boolean;
  planSlug?: string | null;
  checkoutSuccess?: boolean;
}

export function PremiumActivatedTracker({
  isPremium,
  planSlug,
  checkoutSuccess,
}: PremiumActivatedTrackerProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (checkoutSuccess && !fired.current) {
      fired.current = true;
      sendGa4PaymentApproved({ planSlug: planSlug ?? undefined, source: "minha_assinatura" });
    }
    if (isPremium && !fired.current) {
      fired.current = true;
      sendGa4PremiumActivated({ planSlug: planSlug ?? undefined, source: "minha_assinatura" });
    }
  }, [isPremium, planSlug, checkoutSuccess]);

  return null;
}
