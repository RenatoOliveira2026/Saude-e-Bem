import { Button } from "@/components/ui/Button";
import { billingProfileRedirectUrl } from "@/lib/billing/guards";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface BillingProfileStatusProps {
  isLoggedIn: boolean;
  billingComplete: boolean;
  returnPath?: string;
}

export function BillingProfileStatus({
  isLoggedIn,
  billingComplete,
  returnPath = routes.assinar,
}: BillingProfileStatusProps) {
  if (!isLoggedIn) {
    return (
      <div className="mb-6 rounded-xl border border-border bg-surface px-4 py-4 text-sm text-muted">
        <p>
          <Link href={`${routes.entrar}?redirect=${encodeURIComponent(returnPath)}`} className="font-medium text-sage hover:underline">
            Entre na sua conta
          </Link>{" "}
          para assinar o Clube Premium.
        </p>
      </div>
    );
  }

  if (!billingComplete) {
    return (
      <div className="mb-6 rounded-xl border border-gold/40 bg-gold-muted/20 px-4 py-4">
        <p className="text-sm font-medium text-forest">
          Antes de pagar, complete seus dados.
        </p>
        <p className="mt-1 text-sm text-muted">
          Precisamos do seu CPF, celular e endereço para liberar o pagamento.
        </p>
        <Button
          href={billingProfileRedirectUrl(returnPath)}
          variant="gold"
          size="sm"
          className="mt-4"
        >
          Completar cadastro
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-sage/40 bg-sage-muted/30 px-4 py-4">
      <p className="text-sm font-medium text-forest">
        Cadastro completo. Você já pode continuar para o pagamento.
      </p>
    </div>
  );
}
