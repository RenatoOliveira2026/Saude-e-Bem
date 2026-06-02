import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/icons";
import { trustSignals } from "@/lib/home-content";
import { routes } from "@/lib/routes";

export function HeroPremiumSection() {
  return (
    <section className="relative overflow-hidden bg-off-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(111,143,114,0.18),transparent),radial-gradient(ellipse_60%_50%_at_0%_100%,rgba(201,168,106,0.14),transparent)]"
        aria-hidden
      />

      <Container className="relative py-16 md:py-24 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-xl">
            <Badge variant="gold" className="mb-6">
              Saúde & Bem · Longevidade com propósito
            </Badge>

            <h1 className="font-heading text-4xl leading-[1.08] text-forest text-balance sm:text-5xl lg:text-[3.35rem]">
              Sua jornada para uma vida mais saudável começa hoje.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted text-pretty md:text-xl">
              Conteúdo confiável, hábitos saudáveis, protocolos e ferramentas para
              ajudar você a viver com mais energia, equilíbrio e longevidade.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={routes.cadastro} size="lg">
                Começar Agora
              </Button>
              <Button href={routes.protocolos} variant="outline" size="lg">
                Explorar Protocolos
              </Button>
            </div>

            <ul className="mt-10 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-8">
              {trustSignals.map((signal) => (
                <li
                  key={signal}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-muted text-sage">
                    <Icon name="vitality" size={12} aria-hidden />
                  </span>
                  {signal}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-surface p-1 shadow-elevated">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-forest via-forest-light to-sage sm:aspect-[5/6]">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f8f6f2' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  }}
                  aria-hidden
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light/90">
                    Natureza · Ciência · Longevidade
                  </p>
                  <p className="mt-3 font-heading text-2xl leading-snug text-off-white text-balance md:text-3xl">
                    Um espaço premium para cuidar do corpo e da mente com leveza.
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-off-white/75">
                    Protocolos guiados, biblioteca gratuita e conteúdo baseado em
                    evidências — sem promessas vazias.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-border bg-surface px-5 py-4 shadow-card md:block">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-muted text-sage">
                  <Icon name="leaf" size={20} aria-hidden />
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold text-forest">
                    Bem-estar integrado
                  </p>
                  <p className="text-xs text-muted">Corpo, mente e hábitos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
