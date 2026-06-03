"use client";

export function OfflineReloadButton() {
  return (
    <button
      type="button"
      className="text-xs text-muted underline underline-offset-2 hover:text-forest"
      onClick={() => window.location.reload()}
    >
      Tentar recarregar
    </button>
  );
}
