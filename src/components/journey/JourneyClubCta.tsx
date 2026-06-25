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
                Premium disponível
              </p>
              <h2 className="mt-3 font-heading text-2xl text-off-white md:text-3xl">
                Clube Saúde & Bem
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-off-white/70">
                Desbloqueie protocolos premium, ferramentas avançadas e biblioteca
                ampliada com acesso imediato após a confirmação do pagamento.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "Protocolos exclusivos atualizados mensalmente",
                  "Ferramentas avançadas e biblioteca ampliada",
                  "Checkout seguro via Mercado Pago",
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
              <Button href={routes.assinar} variant="gold" size="lg">
                Assinar Premium
              </Button>
              <Button
                href={`${routes.clube}#planos`}
                variant="outline"
                size="md"
                className="border-off-white/30 text-off-white hover:bg-off-white/10"
              >
                Conhecer benefícios
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
