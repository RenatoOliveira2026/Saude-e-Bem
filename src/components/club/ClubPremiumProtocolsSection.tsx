import { ProtocolCard } from "@/components/pages/ProtocolCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getProtocols } from "@/lib/data/repositories/protocols.repository";
import { routes } from "@/lib/routes";

export async function ClubPremiumProtocolsSection() {
  const all = await getProtocols();
  const premium = all.filter((p) => p.isPremium).slice(0, 10);

  if (premium.length === 0) return null;

  return (
    <Section background="default">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Protocolos Premium
          </p>
          <h2 className="mt-3 font-heading text-3xl text-forest text-balance md:text-4xl">
            10 protocolos completos para sua jornada
          </h2>
          <p className="mt-4 text-muted leading-relaxed text-pretty">
            Cada protocolo inclui objetivo, duração, passo a passo diário, checklist e
            benefícios esperados — disponíveis na biblioteca e na área de protocolos do
            Clube Premium.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {premium.map((protocol) => (
            <ProtocolCard key={protocol.slug} protocol={protocol} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={routes.protocolos} variant="outline">
            Ver todos os protocolos
          </Button>
          <Button href={routes.biblioteca} variant="primary">
            Explorar biblioteca
          </Button>
        </div>
      </Container>
    </Section>
  );
}
