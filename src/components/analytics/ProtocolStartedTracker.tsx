"use client";

import { sendGa4ProtocolStarted } from "@/lib/analytics/growth-events";
import { useEffect, useRef } from "react";

interface ProtocolStartedTrackerProps {
  slug: string;
  title: string;
}

export function ProtocolStartedTracker({ slug, title }: ProtocolStartedTrackerProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    sendGa4ProtocolStarted({
      contentSlug: slug,
      contentTitle: title,
      source: "protocol_page",
    });
  }, [slug, title]);

  return null;
}
