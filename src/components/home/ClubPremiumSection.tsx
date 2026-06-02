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
              Em breve
            </Badge>
            <h2 className="font-heading text-3xl text-off-white text-balance md:text-4xl">
              Em breve: Clube Saúde & Bem
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-off-white/75">
              O próximo nível da sua jornada — comunidade, conteúdo premium e
              ferramentas avançadas em um só lugar.
            </p>
            <Button
              href={`${routes.clube}#lista-espera`}
              variant="gold"
              size="lg"
              className="mt-8"
            >
              Entrar na lista de interesse
            </Button>
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
