import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { PremiumBenefitsHubData } from "@/lib/premium/benefits-hub";
import Link from "next/link";

interface PremiumBenefitsHubProps {
  data: PremiumBenefitsHubData;
}

export function PremiumBenefitsHub({ data }: PremiumBenefitsHubProps) {
  return (
    <div className="space-y-10">
      <BenefitSection title="Novidades" items={data.novidades} empty="Nenhuma novidade no momento." />
      <BenefitSection
        title="Conteúdos em destaque"
        items={data.destaques}
        empty="Destaques em atualização."
      />
      <BenefitSection
        title="Mais acessados"
        items={data.maisAcessados}
        empty="Rankings em construção."
      />
      <BenefitSection
        title="Recomendações da semana"
        items={data.recomendacoesSemana}
        empty="Novas recomendações em breve."
      />
    </div>
  );
}

function BenefitSection({
  title,
  items,
  empty,
}: {
  title: string;
  items: PremiumBenefitsHubData["novidades"];
  empty: string;
}) {
  return (
    <section>
      <h2 className="font-heading text-xl text-forest">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{empty}</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} href={item.href} className="group">
              <Card variant="muted" hover padding="lg" className="h-full">
                <div className="flex flex-wrap gap-2">
                  {item.badge && <Badge variant="gold">{item.badge}</Badge>}
                  {item.isPremium && <Badge variant="sage">Premium</Badge>}
                </div>
                <h3 className="mt-3 font-heading text-base text-forest group-hover:text-sage">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{item.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
