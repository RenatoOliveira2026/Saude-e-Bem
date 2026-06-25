import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import {
  ClubSubscribeButtons,
  ClubSubscribePlanButton,
} from "@/components/club/ClubSubscribeButtons";
import { Icon } from "@/components/icons";
import {
  CLUB_PLAN_COMPARISON,
  FREE_PLAN_BENEFITS,
  PREMIUM_PLAN_BENEFITS,
  formatMembershipPrice,
} from "@/lib/membership/constants";
import type { MembershipPlanRecord } from "@/lib/membership/types";
import { isRealCheckoutEnabled } from "@/lib/payments/config";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

interface ClubPublicSectionsProps {
  plans: MembershipPlanRecord[];
}

export function ClubIntroSection() {
  return (
    <Section background="white" spacing="compact">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-sage">
          Área Premium
        </p>
        <h2 className="mt-3 font-heading text-3xl text-forest text-balance md:text-4xl">
          Sua jornada de saúde, elevada ao próximo nível
        </h2>
        <p className="mt-4 text-muted leading-relaxed text-pretty">
          O Clube Saúde & Bem reúne protocolos avançados, ferramentas exclusivas,
          biblioteca ampliada e uma área de membros pensada para quem leva
          longevidade e bem-estar a sério — com transparência e base científica.
        </p>
      </div>
    </Section>
  );
}

export function ClubBenefitsSplit() {
  return (
    <Section background="default">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card variant="muted" padding="lg">
          <Badge variant="sage" className="mb-4 w-fit">
            Plano Gratuito
          </Badge>
          <h3 className="font-heading text-xl text-forest">Comece sem custo</h3>
          <p className="mt-2 text-sm text-muted">
            Explore conteúdos abertos, ferramentas básicas e construa sua jornada.
          </p>
          <ul className="mt-6 space-y-2.5">
            {FREE_PLAN_BENEFITS.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-graphite">
                <span className="text-sage" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Button href={routes.cadastro} variant="outline" className="mt-8 w-full justify-center">
            Criar conta gratuita
          </Button>
        </Card>

        <Card variant="featured" padding="lg">
          <Badge variant="gold" className="mb-4 w-fit">
            Plano Premium
          </Badge>
          <h3 className="font-heading text-xl text-forest">Desbloqueie o ecossistema</h3>
          <p className="mt-2 text-sm text-muted">
            Protocolos exclusivos, ferramentas avançadas e suporte prioritário.
          </p>
          <ul className="mt-6 space-y-2.5">
            {PREMIUM_PLAN_BENEFITS.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-graphite">
                <span className="text-gold" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Button href={routes.assinar} variant="gold" className="mt-8 w-full justify-center">
            Assinar Premium
          </Button>
        </Card>
      </div>
    </Section>
  );
}

export function ClubPlanComparison() {
  return (
    <Section background="white">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="font-heading text-3xl text-forest">Gratuito x Premium</h2>
        <p className="mt-3 text-sm text-muted">
          Compare o que cada plano oferece na plataforma Saúde & Bem.
        </p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-soft">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-sage-muted/40">
              <th className="px-5 py-4 font-heading text-forest">Recurso</th>
              <th className="px-5 py-4 font-heading text-forest">Gratuito</th>
              <th className="px-5 py-4 font-heading text-forest">Premium</th>
            </tr>
          </thead>
          <tbody>
            {CLUB_PLAN_COMPARISON.map((row) => (
              <tr key={row.feature} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium text-graphite">{row.feature}</td>
                <td className="px-5 py-3 text-muted">
                  <ComparisonCell value={row.free} />
                </td>
                <td className="px-5 py-3 text-muted">
                  <ComparisonCell value={row.premium} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function ComparisonCell({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span>{value}</span>;
  return value ? (
    <Icon name="vitality" size={18} className="text-sage" aria-label="Incluído" />
  ) : (
    <span className="text-muted-light" aria-label="Não incluído">
      —
    </span>
  );
}

export function ClubMembershipPlans({ plans }: ClubPublicSectionsProps) {
  const checkoutReady = isRealCheckoutEnabled();
  const paidPlans = plans.filter((p) => p.billingCycle !== "free");

  return (
    <Section background="default" id="planos">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <Badge variant="gold" className="mb-4">
          Planos
        </Badge>
        <h2 className="font-heading text-3xl text-forest">Escolha seu plano</h2>
        <p className="mt-4 text-muted">
          {checkoutReady
            ? "Assinatura disponível — escolha mensal ou anual."
            : "Estrutura pronta — cobrança será ativada após validação final do pagamento."}
        </p>
      </div>
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isFree = plan.billingCycle === "free";
          const isAnnual = plan.billingCycle === "annual";
          const isMonthly = plan.billingCycle === "monthly";

          return (
            <Card
              key={plan.id}
              variant={isAnnual ? "featured" : "default"}
              padding="lg"
              className={cn("flex flex-col", isAnnual && "md:-translate-y-1")}
            >
              {isAnnual && (
                <Badge variant="gold" className="mb-4 w-fit">
                  Mais escolhido
                </Badge>
              )}
              <h3 className="font-heading text-xl text-forest">{plan.name}</h3>
              <div className="mt-3 font-heading text-3xl font-bold text-forest">
                {formatMembershipPrice(plan)}
              </div>
              <p className="mt-3 text-sm text-muted">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-graphite">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-gold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {isFree ? (
                <Button
                  href={routes.cadastro}
                  variant="outline"
                  className="mt-8 w-full justify-center"
                >
                  Cadastrar grátis
                </Button>
              ) : checkoutReady && isMonthly ? (
                <ClubSubscribePlanButton
                  plan="premium_monthly"
                  variant="primary"
                  className="w-full justify-center"
                >
                  Assinar Premium Mensal
                </ClubSubscribePlanButton>
              ) : checkoutReady && isAnnual ? (
                <ClubSubscribePlanButton
                  plan="premium_annual"
                  variant="gold"
                  className="w-full justify-center"
                >
                  Assinar Premium Anual
                </ClubSubscribePlanButton>
              ) : (
                <Button
                  href="#lista-espera"
                  variant={isAnnual ? "gold" : "outline"}
                  className="mt-8 w-full justify-center"
                >
                  Assinatura em breve
                </Button>
              )}
            </Card>
          );
        })}
      </div>
      {checkoutReady && (
        <div className="mx-auto mt-12 max-w-2xl">
          <ClubSubscribeButtons />
        </div>
      )}
      {!checkoutReady && paidPlans.length > 0 && (
        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-muted">
          Os valores exibidos são informativos. A cobrança real só será ativada
          após aprovação da integração de pagamento em produção.
        </p>
      )}
    </Section>
  );
}

export function ClubCtaBand() {
  return (
    <Section background="forest" spacing="compact">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <h2 className="font-heading text-2xl text-off-white md:text-3xl">
          Pronto para entrar no Clube?
        </h2>
        <p className="text-off-white/75 text-pretty">
          Crie sua conta gratuita ou assine o plano premium com checkout seguro via Mercado Pago.
        </p>
        <div className="mt-6 w-full max-w-xl">
          {isRealCheckoutEnabled() ? (
            <ClubSubscribeButtons tone="onDark" />
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              <Button href={routes.cadastro} variant="gold" size="md">
                Criar conta gratuita
              </Button>
              <Button
                href="#planos"
                variant="outline"
                size="md"
                className="border-off-white/30 text-off-white"
              >
                Ver planos premium
              </Button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
