import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { trustSignals } from "@/lib/home-content";
import { routes } from "@/lib/routes";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-off-white">
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-sage-muted/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-56 -left-40 h-[480px] w-[480px] rounded-full bg-gold-muted/35 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative py-10 md:py-14 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl lg:max-w-none">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gradient-to-r from-gold-muted via-white to-gold-muted whitespace-nowrap px-4 py-2 font-heading text-[11px] font-bold uppercase tracking-[0.08em] text-forest sm:tracking-[0.14em] shadow-[0_0_0_4px_rgba(233,125,75,0.10),0_6px_20px_-6px_rgba(233,125,75,0.45)] sm:text-[13px]">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
              </span>
              Plataforma premium de longevidade
            </span>

            <h1 className="font-heading text-4xl leading-[1.1] text-forest text-balance sm:text-5xl lg:text-[3.25rem]">
              Sua jornada para uma vida com{" "}
              <span className="whitespace-nowrap">
                <span className="relative inline-block text-sage">
                  saúde
                  <span
                    className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gold/70"
                    aria-hidden="true"
                  />
                </span>
                ,
              </span>{" "}
              vitalidade e longevidade
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted text-pretty md:text-xl">
              Descubra seu perfil, escolha seus objetivos e siga protocolos
              baseados em ciência — tudo em um só lugar, com visual acolhedor e
              foco em resultados reais.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={routes.ferramentas} size="lg">
                Descobrir meu perfil
              </Button>
              <Button href={routes.protocolos} variant="outline" size="lg">
                Ver protocolos
              </Button>
            </div>

            <ul className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {trustSignals.map((signal) => (
                <li
                  key={signal}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-muted text-xs text-sage"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  {signal}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative rounded-2xl border border-border bg-surface p-6 shadow-elevated md:p-8">
              <div className="absolute right-4 -top-3 rounded-full bg-gold px-4 py-1.5 font-heading text-xs font-semibold text-forest shadow-soft">
                Avaliação gratuita
              </div>

              <p className="font-heading text-sm font-semibold uppercase tracking-wider text-sage">
                Seu painel de saúde
              </p>
              <p className="mt-2 font-heading text-2xl text-forest">
                Perfil de Vitalidade
              </p>

              <div className="mt-6 space-y-4">
                {[
                  { label: "Energia", value: 78, color: "bg-sage" },
                  { label: "Sono", value: 65, color: "bg-forest" },
                  { label: "Longevidade", value: 82, color: "bg-gold" },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-graphite">{metric.label}</span>
                      <span className="font-heading font-semibold text-forest">
                        {metric.value}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-sage-muted">
                      <div
                        className={`h-full rounded-full ${metric.color}`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl bg-sage-muted/60 p-4">
                <p className="text-sm leading-relaxed text-muted">
                  <span className="font-semibold text-forest">
                    Próximo passo:
                  </span>{" "}
                  Complete sua avaliação e receba um plano personalizado.
                </p>
              </div>

              <Button
                href={routes.ferramentas}
                variant="secondary"
                size="md"
                className="mt-6 w-full justify-center"
              >
                Iniciar avaliação
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
