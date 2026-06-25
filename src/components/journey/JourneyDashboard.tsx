import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { categoryIcons, Icon, IconBox } from "@/components/icons";
import type { JourneyData } from "@/lib/journey/types";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { TrailAnalyticsTracker } from "@/components/analytics/TrailAnalyticsTracker";
import { ContinueReadingSection } from "@/components/club/ContinueReadingSection";
import { EngagementPanel } from "@/components/engagement/EngagementPanel";
import { LoyaltyPanel } from "@/components/loyalty/LoyaltyPanel";
import { JourneyClubCta } from "./JourneyClubCta";
import { JourneyEmptyState } from "./JourneyEmptyState";
import { JourneyProgressSection } from "./JourneyProgressSection";
import { JourneySectionHeader } from "./JourneySectionHeader";
import { JourneyTrailsSection } from "./JourneyTrailsSection";

interface JourneyDashboardProps {
  data: JourneyData;
}

export function JourneyDashboard({ data }: JourneyDashboardProps) {
  const firstName = data.displayName.split(" ")[0];

  return (
    <>
      <TrailAnalyticsTracker trails={data.trails} />
      {/* 1. Saudação personalizada */}
      <Section background="default" spacing="compact">
        <Container>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 md:p-10">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sage-muted/60"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-gold-muted/30"
              aria-hidden="true"
            />
            <div className="relative">
              <Badge variant="gold" className="mb-4">
                Minha Jornada
              </Badge>
              <h1 className="font-heading text-3xl text-forest md:text-4xl">
                Olá {firstName}{" "}
                <span aria-hidden="true">👋</span>
              </h1>
              <p className="mt-4 max-w-2xl text-muted leading-relaxed">
                Bem-vindo à sua área exclusiva. Acompanhe seu objetivo, explore
                protocolos curados e avance nos próximos passos da sua jornada.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-light">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="clock" size={14} />
                  Dia {data.daysOnJourney} da jornada
                </span>
                <span aria-hidden="true">·</span>
                <span>Membro desde {data.memberSince}</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={routes.onboarding} variant="gold" size="sm">
                  Guia de boas-vindas
                </Button>
                <Button href={routes.perfil} variant="outline" size="sm">
                  Editar perfil
                </Button>
                <Button href={routes.protocolos} variant="secondary" size="sm">
                  Explorar protocolos
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Progresso premium */}
      <Section background="white">
        <Container>
          <JourneyProgressSection progress={data.progress} />
        </Container>
      </Section>

      {/* 3. Objetivo principal */}
      <Section background="default">
        <Container>
          <GoalCard data={data} />
        </Container>
      </Section>

      {/* 4. Trilhas premium */}
      <Section background="white">
        <Container>
          <JourneyTrailsSection trails={data.trails} activeTrail={data.activeTrail} />
        </Container>
      </Section>

      {data.continueReading.length > 0 && (
        <Section background="sage" spacing="compact">
          <Container>
            <ContinueReadingSection items={data.continueReading} />
          </Container>
        </Section>
      )}

      {/* Engajamento — Fase 9.5 */}
      <Section background="white">
        <Container>
          <EngagementPanel engagement={data.engagement} />
        </Container>
      </Section>

      {/* Fidelização — Fase 9.5 */}
      <Section background="default">
        <Container>
          <LoyaltyPanel loyalty={data.loyalty} />
        </Container>
      </Section>

      {/* 5. Protocolos recomendados */}
      <Section background="default">
        <Container>
          <JourneySectionHeader
            title="Protocolos recomendados"
            description={
              data.goalLabel
                ? `Curados para: ${data.goalLabel}`
                : "Protocolos selecionados para começar sua transformação."
            }
            href={routes.protocolos}
            linkLabel="Ver todos"
          />
          {data.recommendedProtocols.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.recommendedProtocols.map((protocol) => (
                <Link
                  key={protocol.id}
                  href={routes.protocolo(protocol.slug)}
                  className="group"
                >
                  <Card variant="default" hover padding="lg" className="h-full">
                    <IconBox
                      name={categoryIcons[protocol.category]}
                      size={22}
                      className="mb-4"
                    />
                    <Badge variant="default">{protocol.categoryLabel}</Badge>
                    <h3 className="mt-3 font-heading text-lg text-forest group-hover:text-sage">
                      {protocol.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted leading-relaxed">
                      {protocol.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="outline">{protocol.level}</Badge>
                      <Badge variant="outline">{protocol.duration}</Badge>
                    </div>
                    <p className="mt-5 text-sm font-semibold text-forest">
                      Ver protocolo →
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <JourneyEmptyState
                icon="sparkle"
                title="Nenhum protocolo disponível"
                description="Estamos preparando novos protocolos. Enquanto isso, explore a biblioteca completa."
              />
              <div className="mt-6 text-center">
                <Button href={routes.protocolos} variant="secondary" size="md">
                  Ver protocolos
                </Button>
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* 6. Biblioteca recomendada */}
      <Section background="white">
        <Container>
          <JourneySectionHeader
            title="Biblioteca recomendada"
            description={
              data.goalLabel
                ? `Materiais alinhados ao seu objetivo: ${data.goalLabel}`
                : "Guias gratuitos selecionados pela equipe Saúde & Bem."
            }
            href={routes.biblioteca}
            linkLabel="Ver biblioteca"
          />
          {data.librarySuggestions.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.librarySuggestions.map((resource) => (
                <Link
                  key={resource.id}
                  href={routes.bibliotecaItem(resource.slug)}
                  className="group"
                >
                  <Card variant="muted" hover padding="lg" className="h-full">
                    <IconBox
                      name={resource.icon}
                      size={22}
                      className="mb-4 bg-surface shadow-soft"
                    />
                    <Badge variant="default">{resource.categoryLabel}</Badge>
                    <h3 className="mt-3 font-heading text-lg text-forest group-hover:text-sage">
                      {resource.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted leading-relaxed">
                      {resource.description}
                    </p>
                    <p className="mt-4 text-xs text-muted-light">
                      {resource.format} · {resource.pages} páginas
                    </p>
                    <p className="mt-4 text-sm font-semibold text-gold">
                      Baixar gratuito →
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <JourneyEmptyState
                icon="library"
                title="Nenhum material disponível"
                description="Novos guias serão adicionados em breve. Visite a biblioteca para explorar o acervo."
              />
              <div className="mt-6 text-center">
                <Button href={routes.biblioteca} variant="outline" size="md">
                  Explorar biblioteca
                </Button>
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* 7. Próximos passos — checklist */}
      <Section background="default">
        <Container>
          <JourneySectionHeader
            title="Próximos passos"
            description="Siga esta checklist para avançar na sua jornada."
          />
          <ul className="mt-8 space-y-3">
            {data.checklist.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="group block">
                  <Card
                    variant={item.completed ? "muted" : "default"}
                    hover={!item.completed}
                    padding="lg"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                          item.completed
                            ? "border-forest bg-forest text-off-white"
                            : "border-border bg-surface text-muted-light group-hover:border-sage"
                        }`}
                        aria-hidden="true"
                      >
                        {item.completed ? "✓" : ""}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Icon
                            name={item.icon}
                            size={16}
                            className="text-gold"
                          />
                          <h3
                            className={`font-heading text-base font-semibold ${
                              item.completed
                                ? "text-muted line-through"
                                : "text-forest group-hover:text-sage"
                            }`}
                          >
                            {item.label}
                          </h3>
                          {item.completed && (
                            <Badge variant="outline" className="text-xs">
                              Concluído
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1.5 text-sm text-muted leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      {!item.completed && (
                        <Icon
                          name="chevron-right"
                          size={18}
                          className="mt-1 shrink-0 text-muted-light group-hover:text-sage"
                        />
                      )}
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 8. CTA Clube */}
      <JourneyClubCta />
    </>
  );
}

function GoalCard({ data }: { data: JourneyData }) {
  return (
    <Card variant="featured" padding="lg">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <IconBox name="vitality" size={28} className="shrink-0 bg-gold-muted" />
        <div className="flex-1">
          <p className="font-heading text-xs font-semibold uppercase tracking-widest text-sage">
            Objetivo principal
          </p>
          {data.hasGoal && data.goalLabel ? (
            <>
              <h2 className="mt-2 font-heading text-2xl text-forest md:text-3xl">
                {data.goalLabel}
              </h2>
              {data.goalDescription && (
                <p className="mt-3 max-w-2xl text-sm text-muted leading-relaxed">
                  {data.goalDescription}
                </p>
              )}
              <Button
                href={routes.perfil}
                variant="ghost"
                size="sm"
                className="mt-4 px-0"
              >
                Alterar objetivo →
              </Button>
            </>
          ) : (
            <>
              <h2 className="mt-2 font-heading text-xl text-forest md:text-2xl">
                Complete seu perfil.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-muted leading-relaxed">
                Defina seu objetivo principal — Mais Energia, Sono, Saúde
                Intestinal, Emagrecimento ou Longevidade — para receber
                recomendações personalizadas.
              </p>
              <Button
                href={routes.perfil}
                variant="gold"
                size="md"
                className="mt-6"
              >
                Completar perfil
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
