"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  formatPlanAmount,
  formatPlanPriceLabel,
  paymentMethodOptions,
} from "@/lib/payments/constants";
import type { CheckoutPlanId } from "@/lib/payments/plans";
import { ASSINAR_PLANS } from "@/lib/payments/plans";
import type { PaymentMethod } from "@/lib/payments/types";
import { routes } from "@/lib/routes";
import { useState } from "react";

export function SubscribeCheckoutForm() {
  const [selectedPlan, setSelectedPlan] =
    useState<CheckoutPlanId>("premium_monthly");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("pix");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const activePlan = ASSINAR_PLANS.find((plan) => plan.id === selectedPlan);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
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
      if (!response.ok) {
        setError(data.error ?? "Não foi possível iniciar o checkout.");
        return;
      }

      if (data.stub && data.message) {
        setInfo(data.message);
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError("Falha de rede ao iniciar checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium text-forest">Escolha seu plano</p>
        <div className="grid gap-3 sm:grid-cols-3">
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
        <p className="text-sm font-medium text-forest">Forma de pagamento</p>
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
        {loading ? "Redirecionando..." : "Ir para checkout Mercado Pago"}
      </Button>

      <p className="text-center text-xs text-muted">
        Pagamento processado com segurança via Mercado Pago.{" "}
        <a href={routes.minhaAssinatura} className="text-sage hover:underline">
          Ver minha assinatura
        </a>
      </p>
    </div>
  );
}
