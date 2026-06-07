import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ActiveBenefitsList } from "@/components/subscription/ActiveBenefitsList";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import {
  formatSubscriptionDate,
  subscriptionStatusLabels,
} from "@/lib/club/constants";
import {
  formatPlanPriceLabel,
  FREE_PLAN,
  getPlanById,
  PREMIUM_ANNUAL_PLAN,
  PREMIUM_MONTHLY_PLAN,
} from "@/lib/payments/plans";
import { profilePlanLabels, profilePlanStatusLabels } from "@/lib/subscription";
import type { SubscriptionBillingData } from "@/lib/payments/types";
import { routes } from "@/lib/routes";
import { PaymentHistoryList } from "./PaymentHistoryList";
import { FinancialHistoryList } from "./FinancialHistoryList";
import { CancelSubscriptionButton } from "./CancelSubscriptionButton";

interface SubscriptionDashboardProps {
  data: SubscriptionBillingData;
}

function providerLabel(provider: string | null): string {
  if (provider === "mercadopago") return "Mercado Pago";
  if (provider === "stripe") return "Stripe";
  if (provider === "manual") return "Manual";
  return provider ?? "—";
}

export function SubscriptionDashboard({ data }: SubscriptionDashboardProps) {
  const { membership } = data;
  const subscription = membership.subscription;

  const billingPlanId =
    subscription?.billingPlanId ??
    (typeof data.payments[0]?.metadata?.plan === "string"
      ? data.payments[0].metadata.plan
      : null);

  const activeBillingPlan =
    getPlanById(billingPlanId) ??
    (membership.isPremium ? PREMIUM_MONTHLY_PLAN : null);

  const planSummary = membership.isPremium
    ? activeBillingPlan
      ? `${activeBillingPlan.name} · ${formatPlanPriceLabel(activeBillingPlan)}`
      : "Plano Premium"
    : `Plano Gratuito · ${formatPlanPriceLabel(FREE_PLAN)} · planos a partir de ${formatPlanPriceLabel(PREMIUM_MONTHLY_PLAN)}`;

  return (
    <div className="space-y-8">
      <section>
        <Badge variant="gold" className="mb-3">
          Assinatura
        </Badge>
        <h1 className="font-heading text-3xl text-forest md:text-4xl">
          Minha assinatura
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Acompanhe seu plano, próxima renovação e histórico de pagamentos.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted-light">
            Plano atual
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PlanBadge tier={membership.isPremium ? "premium" : "free"} />
          </div>
          <p className="mt-2 font-heading text-xl text-forest">
            {profilePlanLabels[membership.profilePlan]}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted-light">
            Status
          </p>
          <p className="mt-1 font-heading text-2xl text-forest">
            {subscriptionStatusLabels[membership.status]}
          </p>
          <p className="mt-1 text-xs text-muted">
            {profilePlanStatusLabels[membership.profilePlan]}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted-light">
            Próxima renovação
          </p>
          <p className="mt-1 font-heading text-2xl text-forest">
            {data.nextRenewal
              ? formatSubscriptionDate(data.nextRenewal)
              : "—"}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted-light">
            Provedor
          </p>
          <p className="mt-1 font-heading text-2xl text-forest">
            {providerLabel(membership.provider)}
          </p>
        </Card>
      </section>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl text-forest">Detalhes do plano</h2>
            <p className="mt-2 text-sm text-muted">{planSummary}</p>
            {membership.isPremium && membership.expiresAt && (
              <p className="mt-1 text-sm text-muted">
                Válido até {formatSubscriptionDate(membership.expiresAt)}
              </p>
            )}
            {membership.isPremium && subscription?.autoRenew && (
              <p className="mt-1 text-sm text-muted">
                Renovação automática ativa
              </p>
            )}
          </div>
          {!membership.isPremium && (
            <Button href={routes.assinar} variant="gold" size="sm">
              Assinar agora
            </Button>
          )}
        </div>
      </Card>

      <ActiveBenefitsList membership={membership} />

      {membership.isPremium &&
        subscription &&
        (subscription.status === "active" ||
          subscription.status === "trialing") && (
          <CancelSubscriptionButton
            cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
            expiresAt={membership.expiresAt}
            autoRenew={subscription.autoRenew}
          />
        )}

      <section>
        <h2 className="font-heading text-xl text-forest">
          Histórico de pagamentos
        </h2>
        <div className="mt-4">
          <PaymentHistoryList payments={data.payments} />
        </div>
      </section>

      <section>
        <h2 className="font-heading text-xl text-forest">
          Linha do tempo financeira
        </h2>
        <p className="mt-1 text-sm text-muted">
          Checkout, aprovações e ciclo da assinatura Premium.
        </p>
        <div className="mt-4">
          <FinancialHistoryList events={data.financialEvents} />
        </div>
      </section>
    </div>
  );
}
