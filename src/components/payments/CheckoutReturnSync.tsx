"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CheckoutReturnSyncProps {
  externalReference: string;
  status: "success" | "pending";
}

export function CheckoutReturnSync({
  externalReference,
  status,
}: CheckoutReturnSyncProps) {
  const router = useRouter();
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "success") return;

    let cancelled = false;

    async function syncPayment() {
      try {
        const response = await fetch("/api/payments/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ externalReference }),
        });

        const data = await response.json();
        if (cancelled) return;

        if (data.ok) {
          setSyncMessage("Assinatura atualizada com sucesso.");
          router.refresh();
        } else if (response.status === 202) {
          setSyncMessage(
            "Pagamento ainda em processamento — aguardando confirmação do Mercado Pago.",
          );
        }
      } catch {
        if (!cancelled) {
          setSyncMessage(
            "Retorno recebido. A confirmação chegará via webhook em instantes.",
          );
        }
      }
    }

    void syncPayment();

    return () => {
      cancelled = true;
    };
  }, [externalReference, status, router]);

  if (status === "pending") {
    return (
      <p className="mb-6 rounded-lg bg-gold-muted/30 px-4 py-3 text-sm text-forest">
        Pagamento pendente — aguardando confirmação (PIX ou boleto).
      </p>
    );
  }

  return (
    <p className="mb-6 rounded-lg bg-sage-muted/40 px-4 py-3 text-sm text-forest">
      {syncMessage ??
        "Pagamento recebido. Sua assinatura será atualizada em instantes."}
    </p>
  );
}
