"use client";

import { ClubCheckoutErrorAlert } from "@/components/club/ClubCheckoutErrorAlert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { billingProfileRedirectUrl } from "@/lib/billing/guards";
import {
  formatPlanAmount,
  formatPlanPriceLabel,
  paymentMethodOptions,
} from "@/lib/payments/constants";
import type { CheckoutPlanId } from "@/lib/payments/plans";
import { ASSINAR_PLANS } from "@/lib/payments/plans";
import type { PaymentMethod } from "@/lib/payments/types";
import { routes } from "@/lib/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function resolvePlanFromSearchParams(
  planFromUrl: string | null,
): CheckoutPlanId {
  if (
    planFromUrl === "premium_annual" ||
    planFromUrl === "premium_monthly" ||
    planFromUrl === "premium_quarterly"
  ) {
    return planFromUrl;
  }
  return "premium_monthly";
}

interface SubscribeCheckoutFormProps {
  billingComplete: boolean;
  isLoggedIn: boolean;
  returnPath?: string;
}

export function SubscribeCheckoutForm({
  billingComplete,
  isLoggedIn,
  returnPath = routes.assinar,
}: SubscribeCheckoutFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plano");

  const [selectedPlan, setSelectedPlan] = useState<CheckoutPlanId>(() =>
    resolvePlanFromSearchParams(planFromUrl),
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("pix");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const activePlan = ASSINAR_PLANS.find((plan) => plan.id === selectedPlan);

  function goToCompletarCadastro() {
    router.push(billingProfileRedirectUrl(returnPath));
  }

  async function handleCheckout() {
    if (!isLoggedIn) {
      router.push(`${routes.entrar}?redirect=${encodeURIComponent(returnPath)}`);
      return;
    }

    if (!billingComplete) {
      goToCompletarCadastro();
      return;
    }

    setLoading(true);
    setError(null);
    setHasActiveSubscription(false);
    setInfo(null);

    try {
      const response = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: selectedMethod,
          plan: selectedPlan,
        }),
      });

      const data = await response.json();
      if (response.status === 428 && data.code === "profile_incomplete") {
        router.push(data.redirectUrl ?? billingProfileRedirectUrl(returnPath));
        return;
      }
      if (response.status === 409) {
        setHasActiveSubscription(true);
        return;
      }
      if (!response.ok) {
        setError(data.error ?? "Não foi possível iniciar o pagamento.");
        return;
      }

      if (data.stub && data.message) {
        setInfo(data.message);
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError("Falha de rede. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const payButtonLabel =
    selectedMethod === "pix"
      ? "Pagar com PIX"
      : selectedMethod === "credit_card"
        ? "Pagar com cartão"
        : "Pagar com boleto";

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium text-forest">Escolha seu plano</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ASSINAR_PLANS.map((plan) => {
            const isPaid = plan.checkoutEnabled;
            const isSelected = isPaid && plan.id === selectedPlan;

            return (
              <label
                key={plan.id}
                className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-colors ${
                  isSelected
                    ? "border-sage bg-sage-muted/30"
                    : "border-border bg-surface hover:border-sage/50"
                } ${!isPaid ? "cursor-default" : ""}`}
              >
                {isPaid && (
                  <input
                    type="radio"
                    name="billing_plan"
                    value={plan.id}
                    checked={isSelected}
                    onChange={() => setSelectedPlan(plan.id as CheckoutPlanId)}
                    className="sr-only"
                  />
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase tracking-wide text-muted-light">
                    {plan.name}
                  </span>
                  {plan.highlightBadge && (
                    <Badge variant="gold" className="text-[10px]">
                      {plan.highlightBadge}
                    </Badge>
                  )}
                </div>
                <span className="mt-2 font-heading text-2xl text-forest">
                  {formatPlanAmount(plan)}
                </span>
                {plan.periodLabel && (
                  <span className="mt-1 text-sm text-muted">
                    / {plan.periodLabel}
                  </span>
                )}
                {plan.savingsLabel && (
                  <span className="mt-2 text-xs font-semibold text-gold">
                    {plan.savingsLabel}
                  </span>
                )}
                {!isPaid && (
                  <span className="mt-3 text-xs text-muted">
                    Plano atual gratuito
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {activePlan && (
        <Card className="border-gold/30 bg-gold-muted/10 p-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <p className="text-sm uppercase tracking-wide text-gold">
              {activePlan.name}
            </p>
            {activePlan.highlightBadge && (
              <Badge variant="gold">{activePlan.highlightBadge}</Badge>
            )}
          </div>
          <p className="mt-2 font-heading text-2xl leading-snug text-forest sm:text-3xl">
            {formatPlanAmount(activePlan)}
          </p>
          <p className="mt-1 text-sm text-muted">
            {formatPlanPriceLabel(activePlan)}
          </p>
          {activePlan.savingsLabel && (
            <p className="mt-3 text-sm font-semibold text-forest">
              {activePlan.savingsLabel}
            </p>
          )}
        </Card>
      )}

      <div className="space-y-3">
        <p className="text-sm font-medium text-forest">Como deseja pagar?</p>
        {(selectedMethod === "pix" || selectedMethod === "ticket") && (
          <p className="rounded-lg border border-sage/40 bg-sage-muted/25 px-4 py-3 text-sm text-forest">
            {selectedMethod === "pix"
              ? "PIX libera acesso por 30 dias no plano mensal ou 365 dias no anual. Para renovação automática, use cartão."
              : "Boleto libera acesso após a compensação, pelo mesmo período do plano escolhido. Para renovação automática, use cartão."}
          </p>
        )}
        {paymentMethodOptions.map((option) => (
          <label
            key={option.id}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
              selectedMethod === option.id
                ? "border-sage bg-sage-muted/30"
                : "border-border bg-surface hover:border-sage/50"
            }`}
          >
            <input
              type="radio"
              name="payment_method"
              value={option.id}
              checked={selectedMethod === option.id}
              onChange={() => setSelectedMethod(option.id)}
              className="mt-1"
            />
            <span>
              <span className="font-medium text-forest">{option.label}</span>
              <span className="mt-0.5 block text-sm text-muted">
                {option.description}
              </span>
            </span>
          </label>
        ))}
      </div>

      {hasActiveSubscription && <ClubCheckoutErrorAlert />}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {info && (
        <p className="rounded-lg bg-sage-muted/40 px-4 py-3 text-sm text-forest">
          {info}
        </p>
      )}

      <Button
        type="button"
        variant="gold"
        size="lg"
        className="w-full"
        disabled={loading}
        onClick={handleCheckout}
      >
        {loading
          ? "Redirecionando..."
          : !isLoggedIn
            ? "Entrar para assinar"
            : !billingComplete
              ? "Completar cadastro para pagar"
              : payButtonLabel}
      </Button>

      <p className="text-center text-xs text-muted">
        Pagamento processado com segurança via Mercado Pago.{" "}
        {selectedPlan === "premium_monthly" && selectedMethod === "credit_card" && (
          <>Renovação automática mensal no cartão. </>
        )}
        {(selectedPlan === "premium_annual" ||
          selectedPlan === "premium_quarterly" ||
          selectedMethod === "pix" ||
          selectedMethod === "ticket") && (
          <>Pagamento único — renove manualmente ao fim do período. </>
        )}
        <a href={routes.minhaAssinatura} className="text-sage hover:underline">
          Ver minha assinatura
        </a>
      </p>
    </div>
  );
}
