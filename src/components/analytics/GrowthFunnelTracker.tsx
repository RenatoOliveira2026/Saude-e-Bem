"use client";

import {
  sendGa4CheckoutStart,
  sendGa4EmailVerified,
  sendGa4PaymentApproved,
  sendGa4PremiumActivated,
  sendGa4SignupComplete,
  sendGa4ProtocolStarted,
  sendGa4DownloadLibrary,
  sendGa4TrailStarted,
  sendGa4TrailCompleted,
} from "@/lib/analytics/growth-events";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

/** Dispara eventos de funil GA4 a partir de query params — sem alterar integrações existentes. */
export function GrowthFunnelTracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const fired = useRef(new Set<string>());

  useEffect(() => {
    const event = searchParams.get("growth_event");
    if (!event || fired.current.has(event)) return;
    fired.current.add(event);

    const origin = searchParams.get("origin") ?? undefined;
    const plan = searchParams.get("plan") ?? undefined;

    switch (event) {
      case "signup_complete":
        sendGa4SignupComplete({ origin, source: pathname });
        break;
      case "email_verified":
        sendGa4EmailVerified({ origin, source: pathname });
        break;
      case "checkout_start":
        sendGa4CheckoutStart({ planSlug: plan, origin, source: pathname });
        break;
      case "payment_approved":
        sendGa4PaymentApproved({ planSlug: plan, origin, source: pathname });
        break;
      case "premium_activated":
      case "premium_subscribe":
        sendGa4PremiumActivated({ planSlug: plan, origin, source: pathname });
        break;
      case "protocol_started":
        sendGa4ProtocolStarted({
          contentSlug: searchParams.get("slug") ?? undefined,
          origin,
          source: pathname,
        });
        break;
      case "download_library":
        sendGa4DownloadLibrary({
          contentSlug: searchParams.get("slug") ?? undefined,
          origin,
          source: pathname,
        });
        break;
      case "trail_started":
        sendGa4TrailStarted({
          trailSlug: searchParams.get("trail") ?? undefined,
          origin,
          source: pathname,
        });
        break;
      case "trail_completed":
        sendGa4TrailCompleted({
          trailSlug: searchParams.get("trail") ?? undefined,
          origin,
          source: pathname,
        });
        break;
      default:
        break;
    }
  }, [searchParams, pathname]);

  return null;
}
