import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/icons";
import { routes } from "@/lib/routes";

export function JourneyClubCta() {
  return (
    <Section background="sage" spacing="compact">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-forest px-8 py-10 md:px-12 md:py-14">
          <div
            className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-gold/10"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-lg">
              <p className="font-heading text-xs font-semibold uppercase tracking-widest text-gold">
                Exclusivo
              </p>
              <h2 className="mt-3 font-heading text-2xl text-off-white md:text-3xl">
                Clube Saúde & Bem
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-off-white/70">
                Desbloqueie protocolos premium, comunidade privada, ferramentas
                avançadas e acompanhamento contínuo para acelerar sua jornada.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "Protocolos exclusivos atualizados mensalmente",
                  "Comunidade fechada com especialistas",
                  "Biblioteca ampliada e suporte prioritário",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-off-white/80"
                  >
                    <Icon name="star" size={14} className="text-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[200px]">
              <Button href={routes.clube} variant="gold" size="lg">
                Conhecer o Clube
              </Button>
              <Button
                href={`${routes.clube}#lista-espera`}
                variant="outline"
                size="md"
                className="border-off-white/30 text-off-white hover:bg-off-white/10"
              >
                Entrar na lista VIP
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
