"use client";

import { ClubCheckoutErrorAlert } from "@/components/club/ClubCheckoutErrorAlert";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { billingProfileRedirectUrl } from "@/lib/billing/guards";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SubscribePlan = "premium_monthly" | "premium_annual";

type CheckoutFeedback =
  | { kind: "none" }
  | { kind: "active_subscription" }
  | { kind: "error"; message: string };

async function ensureBillingProfile(
  router: ReturnType<typeof useRouter>,
  returnPath: string,
): Promise<boolean> {
  const statusRes = await fetch(
    `/api/billing/profile-status?next=${encodeURIComponent(returnPath)}`,
  );
  if (!statusRes.ok) return true;

  const status = (await statusRes.json()) as {
    complete?: boolean;
    redirectUrl?: string;
  };

  if (!status.complete) {
    router.push(status.redirectUrl ?? billingProfileRedirectUrl(returnPath));
    return false;
  }

  return true;
}

async function requestCheckout(plan: SubscribePlan) {
  const res = await fetch("/api/payments/create-subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  const data = (await res.json()) as {
    checkoutUrl?: string;
    error?: string;
    code?: string;
    redirectUrl?: string;
  };
  return { res, data };
}

function resolveCheckoutFeedback(
  res: Response,
  data: { checkoutUrl?: string; error?: string; code?: string; redirectUrl?: string },
  router: ReturnType<typeof useRouter>,
): CheckoutFeedback {
  if (res.status === 428 && data.code === "profile_incomplete") {
    router.push(
      data.redirectUrl ??
        billingProfileRedirectUrl(routes.clube),
    );
    return { kind: "none" };
  }
  if (res.status === 409) {
    return { kind: "active_subscription" };
  }
  if (!res.ok || !data.checkoutUrl) {
    return {
      kind: "error",
      message: data.error ?? "Não foi possível iniciar o checkout.",
    };
  }
  return { kind: "none" };
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
  const [feedback, setFeedback] = useState<CheckoutFeedback>({ kind: "none" });

  async function handleClick() {
    setLoading(true);
    setFeedback({ kind: "none" });
    try {
      if (!(await ensureBillingProfile(router, routes.clube))) {
        setLoading(false);
        return;
      }

      const { res, data } = await requestCheckout(plan);
      if (res.status === 401) {
        router.push(`${routes.entrar}?redirect=${encodeURIComponent(routes.clube)}`);
        return;
      }

      const result = resolveCheckoutFeedback(res, data, router);
      if (result.kind === "none" && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setFeedback(result);
      setLoading(false);
    } catch {
      setFeedback({
        kind: "error",
        message: "Não foi possível iniciar o checkout.",
      });
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 w-full">
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
      {feedback.kind === "active_subscription" && (
        <ClubCheckoutErrorAlert className="mt-4 text-left sm:text-center" />
      )}
      {feedback.kind === "error" && (
        <p className="mt-3 text-center text-sm text-red-600" role="alert">
          {feedback.message}
        </p>
      )}
    </div>
  );
}

interface ClubSubscribeButtonsProps {
  monthlyLabel?: string;
  annualLabel?: string;
  className?: string;
  tone?: "default" | "onDark";
}

export function ClubSubscribeButtons({
  monthlyLabel = "Assinar Premium Mensal",
  annualLabel = "Assinar Premium Anual",
  className,
  tone = "default",
}: ClubSubscribeButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<SubscribePlan | null>(null);
  const [feedback, setFeedback] = useState<CheckoutFeedback>({ kind: "none" });

  async function startCheckout(plan: SubscribePlan) {
    setLoading(plan);
    setFeedback({ kind: "none" });
    try {
      if (!(await ensureBillingProfile(router, routes.clube))) {
        setLoading(null);
        return;
      }

      const { res, data } = await requestCheckout(plan);
      if (res.status === 401) {
        router.push(`${routes.entrar}?redirect=${encodeURIComponent(routes.clube)}`);
        return;
      }

      const result = resolveCheckoutFeedback(res, data, router);
      if (result.kind === "none" && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setFeedback(result);
      setLoading(null);
    } catch {
      setFeedback({
        kind: "error",
        message: "Erro ao assinar.",
      });
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
      {feedback.kind === "active_subscription" && (
        <ClubCheckoutErrorAlert tone={tone} className="mt-4" />
      )}
      {feedback.kind === "error" && (
        <p
          className={cn(
            "mt-4 text-center text-sm",
            tone === "onDark" ? "text-off-white/90" : "text-red-600",
          )}
          role="alert"
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
}
