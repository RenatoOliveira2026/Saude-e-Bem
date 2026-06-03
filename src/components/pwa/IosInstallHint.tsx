"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { PWA_NAME } from "@/lib/pwa/config";
import { useEffect, useState } from "react";

const DISMISS_KEY = "saude-bem-pwa-ios-hint-dismissed";

function isIosSafari(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true);
  return isIOS && !isStandalone;
}

export function IosInstallHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isIosSafari()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    const timer = window.setTimeout(() => setVisible(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Como instalar no iPhone"
      className={cn(
        "fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md",
        "rounded-xl border border-border bg-off-white p-4 shadow-elevated",
      )}
    >
      <p className="font-heading text-sm font-semibold text-forest">
        Adicionar {PWA_NAME} à tela inicial
      </p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">
        <li>Toque em Compartilhar (ícone de quadrado com seta)</li>
        <li>Escolha &quot;Adicionar à Tela de Início&quot;</li>
        <li>Confirme em Adicionar</li>
      </ol>
      <div className="mt-3">
        <Button size="sm" variant="ghost" onClick={dismiss}>
          Entendi
        </Button>
      </div>
    </div>
  );
}
