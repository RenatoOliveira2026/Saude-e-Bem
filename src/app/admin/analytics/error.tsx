"use client";

import { Button } from "@/components/ui/Button";
import { useEffect } from "react";

export default function AdminAnalyticsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin/analytics]", error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="font-heading text-xl font-semibold text-forest">
        Não foi possível carregar o analytics
      </h1>
      <p className="max-w-md text-sm text-muted">
        Verifique se a migration 013 foi aplicada no Supabase e se você tem permissão
        de administrador.
      </p>
      <Button type="button" variant="primary" size="md" onClick={reset}>
        Tentar novamente
      </Button>
    </main>
  );
}
