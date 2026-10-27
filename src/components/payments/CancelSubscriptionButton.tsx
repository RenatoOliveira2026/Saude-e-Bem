"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatSubscriptionDate } from "@/lib/club/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CancelSubscriptionButtonProps {
  cancelAtPeriodEnd: boolean;
  expiresAt: string | null;
  /** Cartão com cobrança automática (muda só o texto; o cancelamento é sempre ao fim do período). */
  autoRenew?: boolean;
}

export function CancelSubscriptionButton({
  cancelAtPeriodEnd,
  expiresAt,
  autoRenew = false,
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
          . Você mantém o acesso ao Clube até lá.
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
      <h3 className="font-heading text-lg text-forest">Cancelar assinatura</h3>
      <p className="mt-2 text-sm text-muted">
        {autoRenew
          ? "Paramos as próximas cobranças no cartão."
          : "Este plano não tem cobrança automática; ao cancelar, ele apenas não será renovado."}{" "}
        Você continua com acesso ao Clube
        {expiresAt ? ` até ${formatSubscriptionDate(expiresAt)}` : " até o fim do período já pago"}.
      </p>
      <p className="mt-2 text-xs text-muted">
        Assinou há até 7 dias? Você pode desistir e receber o valor de volta: escreva para{" "}
        <a href="mailto:contato@saudeebem.com.br" className="underline underline-offset-2">
          contato@saudeebem.com.br
        </a>
        . Veja os{" "}
        <a href="/termos" className="underline underline-offset-2">
          Termos de Uso
        </a>
        .
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
          onClick={() => {
            if (window.confirm("Cancelar a assinatura? Você mantém o acesso até o fim do período já pago.")) {
              void handleCancel(false);
            }
          }}
        >
          {loading ? "Processando..." : "Cancelar assinatura"}
        </Button>
      </div>
    </Card>
  );
}
