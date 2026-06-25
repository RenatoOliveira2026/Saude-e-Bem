"use client";

import {
  sendGa4TrailCompleted,
  sendGa4TrailStarted,
} from "@/lib/analytics/growth-events";
import type { TrailProgress } from "@/lib/premium/trail-progress";
import { useEffect, useRef } from "react";

interface TrailAnalyticsTrackerProps {
  trails: TrailProgress[];
}

export function TrailAnalyticsTracker({ trails }: TrailAnalyticsTrackerProps) {
  const started = useRef(new Set<string>());
  const completed = useRef(new Set<string>());

  useEffect(() => {
    for (const trail of trails) {
      if (trail.percentComplete > 0 && !started.current.has(trail.slug)) {
        started.current.add(trail.slug);
        sendGa4TrailStarted({
          trailSlug: trail.slug,
          contentTitle: trail.title,
          source: "minha_jornada",
        });
      }
      if (trail.percentComplete >= 100 && !completed.current.has(trail.slug)) {
        completed.current.add(trail.slug);
        sendGa4TrailCompleted({
          trailSlug: trail.slug,
          contentTitle: trail.title,
          source: "minha_jornada",
        });
      }
    }
  }, [trails]);

  return null;
}
