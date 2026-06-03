"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatSubscriptionDate } from "@/lib/club/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CancelSubscriptionButtonProps {
  cancelAtPeriodEnd: boolean;
  expiresAt: string | null;
  autoRenew: boolean;
}

export function CancelSubscriptionButton({
  cancelAtPeriodEnd,
  expiresAt,
  autoRenew,
}: CancelSubscriptionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (cancelAtPeriodEnd) {
    return (
      <Card className="border-gold/30 bg-gold-muted/10 p-5">
        <p className="text-sm text-forest">
          Cancelamento agendado
          {expiresAt
            ? ` para ${formatSubscriptionDate(expiresAt)}`
            : " ao fim do período atual"}
          . Você mantém acesso premium até lá.
        </p>
      </Card>
    );
  }

  async function handleCancel(immediate: boolean) {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/payments/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ immediate }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? data.message ?? "Não foi possível cancelar.");
        return;
      }

      setMessage(data.message);
      router.refresh();
    } catch {
      setError("Falha de rede ao cancelar assinatura.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5">
      <h3 className="font-heading text-lg text-forest">Gerenciar assinatura</h3>
      <p className="mt-2 text-sm text-muted">
        {autoRenew
          ? "Renovação automática ativa. Você pode cancelar ao fim do período ou imediatamente."
          : "Cancele sua assinatura premium quando quiser."}
      </p>
      {message && (
        <p className="mt-3 rounded-lg bg-sage-muted/40 px-4 py-3 text-sm text-forest">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => handleCancel(false)}
        >
          {loading ? "Processando..." : "Cancelar ao fim do período"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={loading}
          onClick={() => handleCancel(true)}
        >
          Cancelar agora
        </Button>
      </div>
    </Card>
  );
}
