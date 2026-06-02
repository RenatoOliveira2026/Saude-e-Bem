import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/icons";
import { routes } from "@/lib/routes";

const premiumFeatures = [
  "Protocolos avançados e exclusivos",
  "Biblioteca ampliada com guias premium",
  "Artigos aprofundados para membros",
  "Ferramentas e acompanhamento contínuo",
  "Comunidade privada (em breve)",
];

export function ClubPremiumPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-gold">
          Clube Saúde &amp; Bem Premium
        </p>
        <h1 className="mt-3 font-heading text-3xl text-forest md:text-4xl">
          Desbloqueie o próximo nível da sua jornada
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted leading-relaxed">
          Acesso completo a conteúdos premium, protocolos avançados e materiais
          exclusivos. Pagamento online via Stripe será habilitado em breve.
        </p>
      </section>

      <Card className="mx-auto max-w-xl border-gold/30 bg-gold-muted/15 p-8 text-center">
        <Icon name="star" size={32} className="mx-auto text-gold" />
        <p className="mt-4 font-heading text-4xl text-forest">Em breve</p>
        <p className="mt-2 text-muted">
          A integração com Stripe está preparada na base de dados. Enquanto isso,
          assinaturas podem ser concedidas manualmente pela equipe.
        </p>
        <ul className="mt-6 space-y-2 text-left text-sm text-forest">
          {premiumFeatures.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Icon name="checklist" size={16} className="mt-0.5 shrink-0 text-sage" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={routes.cadastro} variant="gold" size="lg">
            Criar conta gratuita
          </Button>
          <Button href={routes.clubeDashboard} variant="outline" size="lg">
            Ir ao dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
