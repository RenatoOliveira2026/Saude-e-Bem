"use client";

import { useEffect } from "react";

/** Compatibilidade — redireciona links antigos para /auth/verify (Fase 8.5). */
export default function AuthCallbackRedirectPage() {
  useEffect(() => {
    const target = `/auth/verify${window.location.search}${window.location.hash}`;
    window.location.replace(target);
  }, []);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6 text-center">
      <p className="text-sm text-muted">Redirecionando…</p>
    </div>
  );
}
