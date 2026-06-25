import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/icons";
import { clubPremiumBenefits } from "@/lib/home-premium";
import { routes } from "@/lib/routes";

export function ClubPremiumSection() {
  return (
    <Section background="white" id="clube" spacing="spacious">
      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-forest via-forest-light to-sage p-8 md:p-12 lg:p-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <Badge variant="gold" className="mb-5">
              Premium disponível
            </Badge>
            <h2 className="font-heading text-3xl text-off-white text-balance md:text-4xl">
              Clube Saúde & Bem Premium
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-off-white/75">
              Protocolos exclusivos, ferramentas avançadas, biblioteca ampliada e
              área de membros — assine agora com checkout seguro via Mercado Pago.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={routes.assinar} variant="gold" size="lg">
                Assinar Premium
              </Button>
              <Button
                href={`${routes.clube}#planos`}
                variant="outline"
                size="lg"
                className="border-off-white/30 text-off-white hover:bg-off-white/10"
              >
                Conhecer benefícios
              </Button>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {clubPremiumBenefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 rounded-2xl border border-off-white/10 bg-off-white/5 px-5 py-4 backdrop-blur-sm"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <Icon name="vitality" size={16} aria-hidden />
                </span>
                <span className="text-sm font-medium leading-relaxed text-off-white/90">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
