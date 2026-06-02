"use client";

import { Button } from "@/components/ui/Button";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface CmsPreviewModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function CmsPreviewModal({ open, onClose, children }: CmsPreviewModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Preview do conteúdo"
    >
      <button
        type="button"
        className="absolute inset-0 bg-forest/60"
        onClick={onClose}
        aria-label="Fechar preview"
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft-lg">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            Preview — como no site público
          </p>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
