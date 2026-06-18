import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { LaunchFunnelCta } from "@/components/launch";
import { JsonLdScript } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Icon, IconBox } from "@/components/icons";
import { LAUNCH_BENEFITS, LAUNCH_LEAD_MAGNETS } from "@/lib/launch/constants";
import { routes } from "@/lib/routes";
import { webPageJsonLd } from "@/lib/seo/json-ld";
import { buildContentMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

const PAGE_TITLE = "Lançamento Saúde & Bem — Lista VIP e materiais gratuitos";
const PAGE_DESCRIPTION =
  "Conheça o Saúde & Bem, entre na lista VIP do lançamento, baixe o Guia 30 Dias e explore protocolos, biblioteca e Clube Premium.";

export const metadata = buildContentMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: routes.lancamento,
  keywords:
    "lançamento, lista vip, saúde, bem-estar, longevidade, guia gratuito, clube premium",
});

export default function LancamentoPage() {
  return (
    <>
      <JsonLdScript
        data={webPageJsonLd({
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          path: routes.lancamento,
        })}
      />

      <section className="border-b border-border bg-gradient-to-br from-forest via-forest-light to-sage py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="gold" className="mb-5">
              Lançamento oficial
            </Badge>
            <h1 className="font-heading text-4xl leading-tight text-off-white text-balance md:text-5xl">
              Bem-vindo ao Saúde &amp; Bem
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-off-white/75 text-pretty">
              Sua plataforma de saúde, longevidade e bem-estar — conteúdo confiável,
              protocolos práticos, biblioteca curada e comunidade premium para
              transformar conhecimento em ação.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="#lista-vip" variant="gold" size="lg">
                Entrar na lista VIP
              </Button>
              <Button
                href={routes.guia30Dias}
                variant="outline"
                size="lg"
                className="border-off-white/30 text-off-white hover:bg-off-white/10 hover:text-off-white"
              >
                Baixar Guia 30 Dias
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Section background="white">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-heading text-3xl text-forest text-balance">
              Por que o Saúde &amp; Bem?
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Tudo o que você precisa para evoluir com consistência — do conteúdo
              gratuito ao acompanhamento premium.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LAUNCH_BENEFITS.map((item) => (
              <Card key={item.title} variant="default" padding="lg">
                <IconBox name={item.icon} size={22} className="bg-sage-muted text-forest" />
                <h3 className="mt-4 font-heading text-lg text-forest">{item.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="sage" spacing="compact">
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <Badge variant="gold" className="mb-4">
              Materiais gratuitos
            </Badge>
            <h2 className="font-heading text-2xl text-forest md:text-3xl">
              Lead magnets para começar agora
            </h2>
            <p className="mt-4 text-muted">
              Baixe guias, checklists e faça sua avaliação de perfil — sem custo.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {LAUNCH_LEAD_MAGNETS.map((magnet) => (
              <Card key={magnet.title} variant="default" padding="lg" className="flex flex-col">
                <Icon name={magnet.icon} size={24} className="text-sage" />
                <h3 className="mt-4 font-heading text-lg text-forest">{magnet.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">
                  {magnet.description}
                </p>
                <Button href={magnet.href} variant="primary" size="sm" className="mt-6 w-fit">
                  {magnet.cta}
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <LeadCaptureSection
        source="lista-vip-lancamento"
        id="lista-vip"
        title="Lista VIP do lançamento"
        description="Seja o primeiro a saber das novidades, receba condições exclusivas de fundador e materiais antecipados."
        submitLabel="Quero entrar na lista VIP"
        defaultInterest="bem-estar-geral"
        hideInterestSelect
        showWhatsApp
      />

      <Section background="white" spacing="compact">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="gold" className="mb-4">
                Clube Premium
              </Badge>
              <h2 className="font-heading text-2xl text-forest md:text-3xl">
                Conheça o Clube Saúde &amp; Bem
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                Protocolos avançados, biblioteca ampliada, ferramentas exclusivas e
                comunidade para quem quer acelerar resultados com acompanhamento contínuo.
              </p>
              <Button href={routes.clube} variant="gold" size="md" className="mt-6">
                Conhecer o Clube
              </Button>
            </div>
            <div>
              <Badge variant="gold" className="mb-4">
                Curadoria
              </Badge>
              <h2 className="font-heading text-2xl text-forest md:text-3xl">
                Recursos recomendados
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                Produtos digitais, ofertas afiliadas selecionadas e conteúdos
                alinhados ao seu perfil de saúde.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={routes.recomendados} variant="primary" size="md">
                  Ver recomendados
                </Button>
                <Button href={routes.marketplace} variant="outline" size="md">
                  Marketplace
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <LaunchFunnelCta background="forest" />

      <Section background="white" spacing="compact">
        <Container className="text-center text-sm text-muted">
          <p>
            Ao se cadastrar, você concorda com nossa{" "}
            <Link href={routes.privacidade} className="text-forest underline-offset-2 hover:underline">
              política de privacidade
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
