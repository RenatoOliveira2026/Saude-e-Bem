import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/icons";

interface SubscriptionBenefitsSectionProps {
  benefits: string[];
  isPremium: boolean;
}

export function SubscriptionBenefitsSection({
  benefits,
  isPremium,
}: SubscriptionBenefitsSectionProps) {
  return (
    <section>
      <h2 className="font-heading text-xl text-forest">Benefícios ativos</h2>
      <p className="mt-2 text-sm text-muted">
        {isPremium
          ? "Recursos incluídos no seu plano atual."
          : "Recursos disponíveis hoje — assine para desbloquear o premium."}
      </p>
      <Card className="mt-4 p-6">
        <ul className="grid gap-3 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-3 rounded-xl bg-sage-muted/40 px-4 py-3 text-sm text-forest"
            >
              <Icon name="checklist" size={18} className="mt-0.5 shrink-0 text-sage" />
              <span className="text-pretty">{benefit}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
