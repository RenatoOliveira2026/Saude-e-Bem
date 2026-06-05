import { Icon } from "@/components/icons";
import { Card } from "@/components/ui/Card";
import { getActiveBenefits } from "@/lib/subscription";
import type { ClubMembership } from "@/lib/club/types";

interface ActiveBenefitsListProps {
  membership: ClubMembership;
}

export function ActiveBenefitsList({ membership }: ActiveBenefitsListProps) {
  const benefits = getActiveBenefits(membership.profilePlan, membership.isPremium);

  return (
    <Card className="p-6">
      <h2 className="font-heading text-xl text-forest">Benefícios ativos</h2>
      <p className="mt-2 text-sm text-muted">
        {membership.isPremium
          ? "Recursos incluídos no seu plano atual."
          : "Recursos disponíveis no plano gratuito. Assine para desbloquear premium."}
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {benefits.map((benefit) => (
          <li
            key={benefit.id}
            className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3"
          >
            <Icon name="checklist" size={18} className="mt-0.5 shrink-0 text-sage" />
            <div>
              <p className="font-medium text-forest">{benefit.title}</p>
              <p className="mt-1 text-xs text-muted text-pretty">{benefit.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
