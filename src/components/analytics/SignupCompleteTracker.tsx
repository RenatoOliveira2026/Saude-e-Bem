"use client";

import { sendGa4SignupComplete } from "@/lib/analytics/growth-events";
import { useEffect, useRef } from "react";

export function SignupCompleteTracker({ active }: { active: boolean }) {
  const fired = useRef(false);

  useEffect(() => {
    if (!active || fired.current) return;
    fired.current = true;
    sendGa4SignupComplete({ source: "signup_form" });
  }, [active]);

  return null;
}
