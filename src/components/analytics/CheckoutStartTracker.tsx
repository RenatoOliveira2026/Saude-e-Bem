"use client";

import { sendGa4CheckoutStart } from "@/lib/analytics/growth-events";
import { useEffect } from "react";

export function CheckoutStartTracker() {
  useEffect(() => {
    sendGa4CheckoutStart({ source: "/assinar" });
  }, []);
  return null;
}
