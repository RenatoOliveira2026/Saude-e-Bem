import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatSubscriptionDate } from "@/lib/club/constants";
import type { ClubMembership } from "@/lib/club/types";
import {
  formatPlanPriceLabel,
  PREMIUM_ANNUAL_PLAN,
  PREMIUM_MONTHLY_PLAN,
  type BillingPlan,
} from "@/lib/payments/plans";
import { routes } from "@/lib/routes";
import { CancelSubscriptionButton } from "./CancelSubscriptionButton";

interface ManageSubscriptionPanelProps {
  membership: ClubMembership;
  activePlan: BillingPlan | null;
}

function checkoutHref(plan: BillingPlan): string {
  return `${routes.assinar}?plano=${plan.id}`;
}

/**
 * Tudo o que o assinante pode fazer com o plano, num lugar só:
 * renovar (Pix/boleto), trocar entre mensal e anual e cancelar a renovação.
 */
export function ManageSubscriptionPanel({ membership, activePlan }: ManageSubscriptionPanelProps) {
  const subscription = membership.subscription;
  const isActive =
    membership.isPremium &&
    subscription &&
    (subscription.status === "active" || subscription.status === "trialing");

  if (!isActive || !subscription) {
    return (
      <Card className="p-6">
        <h2 className="font-heading text-xl text-forest">Gerenciar assinatura</h2>
        <p className="mt-2 text-sm text-muted">
          {subscription
            ? "Sua assinatura não está ativa. Escolha um plano para voltar a ter acesso ao Clube."
            : "Você ainda não tem assinatura. Escolha um plano para liberar o Clube."}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href={checkoutHref(PREMIUM_MONTHLY_PLAN)} variant="gold" size="sm">
            Mensal · {formatPlanPriceLabel(PREMIUM_MONTHLY_PLAN)}
          </Button>
          <Button href={checkoutHref(PREMIUM_ANNUAL_PLAN)} variant="outline" size="sm">
            Anual · {formatPlanPriceLabel(PREMIUM_ANNUAL_PLAN)}
          </Button>
        </div>
      </Card>
    );
  }

  const isAnnual = activePlan?.id === PREMIUM_ANNUAL_PLAN.id;
  const otherPlan = isAnnual ? PREMIUM_MONTHLY_PLAN : PREMIUM_ANNUAL_PLAN;
  const until = membership.expiresAt ? formatSubscriptionDate(membership.expiresAt) : null;

  return (
    <Card className="p-6">
      <h2 className="font-heading text-xl text-forest">Gerenciar assinatura</h2>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Renovação */}
        <div className="rounded-xl border border-border bg-off-white p-4">
          <h3 className="font-heading text-base font-semibold text-forest">
            {subscription.autoRenew ? "Renovação automática" : "Renovar"}
          </h3>
          {subscription.autoRenew ? (
            <p className="mt-1 text-sm text-muted">
              Seu cartão é cobrado automaticamente{until ? `; próxima cobrança em ${until}` : ""}.
            </p>
          ) : (
            <>
              <p className="mt-1 text-sm text-muted">
                Este plano não renova sozinho{until ? ` e vale até ${until}` : ""}. Ao pagar de
                novo, os dias novos são somados ao fim do período atual.
              </p>
              <Button href={checkoutHref(activePlan ?? PREMIUM_MONTHLY_PLAN)} variant="gold" size="sm" className="mt-3">
                Renovar agora
              </Button>
            </>
          )}
        </div>

        {/* Trocar de plano */}
        <div className="rounded-xl border border-border bg-off-white p-4">
          <h3 className="font-heading text-base font-semibold text-forest">
            {isAnnual ? "Trocar para o mensal" : "Mudar para o anual"}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {isAnnual
              ? `Plano mensal por ${formatPlanPriceLabel(otherPlan)}. O novo período começa quando o atual terminar.`
              : `${formatPlanPriceLabel(otherPlan)}${otherPlan.savingsLabel ? ` — ${otherPlan.savingsLabel.toLowerCase()}` : ""}. Os dias que você já pagou continuam valendo.`}
          </p>
          <Button href={checkoutHref(otherPlan)} variant="outline" size="sm" className="mt-3">
            {isAnnual ? "Trocar para o mensal" : "Mudar para o anual"}
          </Button>
        </div>
      </div>

      {subscription.autoRenew || subscription.cancelAtPeriodEnd ? (
        <div className="mt-4">
          <CancelSubscriptionButton
            cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
            expiresAt={membership.expiresAt}
            autoRenew={subscription.autoRenew}
          />
        </div>
      ) : (
        <p className="mt-4 text-xs text-muted">
          Não há cobrança automática neste plano, então não é preciso cancelar: o acesso
          termina {until ? `em ${until}` : "no fim do período"} se você não renovar.
        </p>
      )}
    </Card>
  );
}
