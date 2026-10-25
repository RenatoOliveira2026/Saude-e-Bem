"use client";

import { cn } from "@/lib/cn";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  client: string;
  slot: string;
  className?: string;
}

/** Bloco responsivo do AdSense, sempre identificado como publicidade. */
export function AdSlot({ client, slot, className }: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Bloqueador de anúncios ou script ainda indisponível: o espaço fica vazio.
    }
  }, []);

  return (
    <aside className={cn("my-10", className)} aria-label="Publicidade">
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-muted">
        Publicidade
      </p>
      <ins
        className="adsbygoogle block min-h-[100px]"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
