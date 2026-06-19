"use client";

import { ClubCheckoutErrorAlert } from "@/components/club/ClubCheckoutErrorAlert";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { billingProfileRedirectUrl } from "@/lib/billing/guards";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SubscribePlan = "premium_monthly" | "premium_annual";

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

function assinarHref(plan: SubscribePlan): string {
  return `${routes.assinar}?plano=${encodeURIComponent(plan)}`;
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
      const returnPath = assinarHref(plan);
      if (!(await ensureBillingProfile(router, returnPath))) {
        setLoading(false);
        return;
      }
      router.push(returnPath);
    } finally {
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
  const [feedback, setFeedback] = useState<string | null>(null);

  async function startCheckout(plan: SubscribePlan) {
    setLoading(plan);
    setFeedback(null);
    try {
      const returnPath = assinarHref(plan);
      if (!(await ensureBillingProfile(router, returnPath))) {
        setLoading(null);
        return;
      }
      router.push(returnPath);
    } catch {
      setFeedback("Não foi possível abrir a página de assinatura.");
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
      {feedback && (
        <p
          className={cn(
            "mt-4 text-center text-sm",
            tone === "onDark" ? "text-off-white/90" : "text-red-600",
          )}
          role="alert"
        >
          {feedback}
        </p>
      )}
    </div>
  );
}
