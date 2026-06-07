import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import {
  formatSubscriptionDate,
  subscriptionStatusLabels,
} from "@/lib/club/constants";
import type { ClubMembership } from "@/lib/club/types";
import {
  formatPlanPriceLabel,
  getPlanById,
  PREMIUM_MONTHLY_PLAN,
} from "@/lib/payments/plans";
import { profilePlanLabels, profilePlanStatusLabels } from "@/lib/subscription";
import { resolveNextRenewal } from "@/lib/subscription/renewal";
import { routes } from "@/lib/routes";

interface SubscriptionStatusCardProps {
  membership: ClubMembership;
}

export function SubscriptionStatusCard({ membership }: SubscriptionStatusCardProps) {
  const billingPlanId =
    membership.subscription?.billingPlanId ?? membership.profilePlan;
  const activePlan = getPlanById(billingPlanId);
  const nextRenewal = resolveNextRenewal(membership);
  const subscriptionStatus =
    membership.subscription?.status ?? (membership.isPremium ? "active" : "none");

  return (
    <Card className="border-sage/30 bg-sage-muted/10 p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="gold" className="mb-3">
            Assinatura
          </Badge>
          <div className="flex flex-wrap items-center gap-2">
            <PlanBadge tier={membership.isPremium ? "premium" : "free"} />
            <Badge variant="sage">
              {subscriptionStatusLabels[subscriptionStatus]}
            </Badge>
          </div>
          <p className="mt-3 font-heading text-xl text-forest">
            {profilePlanLabels[membership.profilePlan]}
          </p>
          <p className="mt-1 text-sm text-muted">
            {profilePlanStatusLabels[membership.profilePlan]}
          </p>
        </div>

        <div className="text-right text-sm text-muted">
          {membership.isPremium && activePlan && (
            <p className="font-medium text-forest">
              {formatPlanPriceLabel(activePlan)}
            </p>
          )}
          {membership.isPremium && nextRenewal && (
            <p className="mt-1">
              Renova em {formatSubscriptionDate(nextRenewal)}
            </p>
          )}
          {!membership.isPremium && (
            <p className="max-w-xs text-pretty">
              Upgrade a partir de {formatPlanPriceLabel(PREMIUM_MONTHLY_PLAN)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {membership.isPremium ? (
          <Button href={routes.minhaAssinatura} variant="outline" size="sm">
            Ver histórico e pagamentos
          </Button>
        ) : (
          <Button href={routes.assinar} variant="gold" size="sm">
            Assinar Premium
          </Button>
        )}
        <Button href={routes.minhaAssinatura} variant="ghost" size="sm">
          Minha assinatura
        </Button>
      </div>
    </Card>
  );
}
