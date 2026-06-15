"use client";

import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SubscribePlan = "premium_monthly" | "premium_annual";

async function requestCheckout(plan: SubscribePlan) {
  const res = await fetch("/api/payments/create-subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  const data = (await res.json()) as { checkoutUrl?: string; error?: string };
  return { res, data };
}

interface ClubSubscribePlanButtonProps {
  plan: SubscribePlan;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function ClubSubscribePlanButton({
  plan,
  children,
  variant,
  size,
  className,
  disabled,
}: ClubSubscribePlanButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const { res, data } = await requestCheckout(plan);
      if (res.status === 401) {
        router.push(`${routes.entrar}?next=${encodeURIComponent(routes.clube)}`);
        return;
      }
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Não foi possível iniciar o checkout.");
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? "Redirecionando…" : children}
    </Button>
  );
}

interface ClubSubscribeButtonsProps {
  monthlyLabel?: string;
  annualLabel?: string;
  className?: string;
}

export function ClubSubscribeButtons({
  monthlyLabel = "Assinar Premium Mensal",
  annualLabel = "Assinar Premium Anual",
  className,
}: ClubSubscribeButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<SubscribePlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(plan: SubscribePlan) {
    setLoading(plan);
    setError(null);
    try {
      const { res, data } = await requestCheckout(plan);
      if (res.status === 401) {
        router.push(`${routes.entrar}?next=${encodeURIComponent(routes.clube)}`);
        return;
      }
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Não foi possível iniciar o checkout.");
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao assinar.");
      setLoading(null);
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={loading !== null}
          onClick={() => startCheckout("premium_monthly")}
        >
          {loading === "premium_monthly" ? "Redirecionando…" : monthlyLabel}
        </Button>
        <Button
          type="button"
          variant="gold"
          size="lg"
          disabled={loading !== null}
          onClick={() => startCheckout("premium_annual")}
        >
          {loading === "premium_annual" ? "Redirecionando…" : annualLabel}
        </Button>
      </div>
      {error && (
        <p className="mt-4 text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
