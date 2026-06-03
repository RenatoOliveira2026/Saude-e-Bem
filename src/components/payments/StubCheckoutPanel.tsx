"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { simulatePaymentApprovalAction } from "@/lib/payments/actions/simulate.actions";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface StubCheckoutPanelProps {
  externalReference: string;
}

export function StubCheckoutPanel({ externalReference }: StubCheckoutPanelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSimulate() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const result = await simulatePaymentApprovalAction(externalReference);
    if (result.ok) {
      setMessage(result.message);
      router.refresh();
    } else {
      setError(result.message);
    }
    setLoading(false);
  }

  return (
    <Card className="border-gold/30 bg-gold-muted/15 p-6">
      <h2 className="font-heading text-lg text-forest">Checkout em modo stub</h2>
      <p className="mt-2 text-sm text-muted">
        Mercado Pago não configurado. Simule a aprovação do pagamento para ativar
        a assinatura premium localmente.
      </p>
      <p className="mt-2 text-xs text-muted-light">
        Referência: {externalReference}
      </p>
      {message && (
        <p className="mt-4 rounded-lg bg-sage-muted/40 px-4 py-3 text-sm text-forest">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="gold"
          size="sm"
          disabled={loading}
          onClick={handleSimulate}
        >
          {loading ? "Processando..." : "Simular pagamento aprovado"}
        </Button>
        <Button href={routes.clubeDashboard} variant="outline" size="sm">
          Ir ao dashboard
        </Button>
      </div>
    </Card>
  );
}
