"use client";

import { trackAnalyticsFromClientAction } from "@/lib/analytics/actions";
import { sendGa4PageView } from "@/lib/analytics/gtag";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Registra page_view por navegação (Supabase + GA4) */
export function PageViewTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    sendGa4PageView(pathname);

    void trackAnalyticsFromClientAction({
      eventType: "page_view",
      sourcePage: pathname,
      sourceType: "navigation",
    });
  }, [pathname]);

  return null;
}
