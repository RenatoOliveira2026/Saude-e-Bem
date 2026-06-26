import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon, IconBox } from "@/components/icons";
import type { IntelligentJourneyPanel } from "@/lib/recommendation-engine/types";
import { RecommendationLink } from "./RecommendationLink";
import { JourneySectionHeader } from "./JourneySectionHeader";

const TYPE_LABELS: Record<string, string> = {
  article: "Artigo",
  protocol: "Protocolo",
  library: "Biblioteca",
  tool: "Ferramenta",
  checklist: "Checklist",
};

interface IntelligentJourneySectionProps {
  panel: IntelligentJourneyPanel;
}

export function IntelligentJourneySection({ panel }: IntelligentJourneySectionProps) {
  const hasContent =
    panel.recommendationOfTheDay ||
    panel.nextStep ||
    panel.recommendedArticle ||
    panel.recommendedProtocol ||
    panel.recommendedLibrary;

  if (!hasContent) return null;

  return (
    <section>
      <JourneySectionHeader
        title="Recomendações inteligentes"
        description="Sugestões personalizadas com base no seu objetivo, histórico e progresso — motor Saúde & Bem (Fase 10.0)."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {panel.recommendationOfTheDay && (
          <RecommendationCard
            item={panel.recommendationOfTheDay}
            badge="Recomendação do dia"
            badgeVariant="gold"
            source="journey_daily"
            featured
          />
        )}

        {panel.nextStep && (
          <RecommendationCard
            item={panel.nextStep}
            badge="Próximo passo"
            badgeVariant="forest"
            source="journey_next_step"
          />
        )}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {panel.recommendedArticle && (
          <RecommendationCard
            item={panel.recommendedArticle}
            badge="Artigo"
            badgeVariant="default"
            source="journey_article"
            compact
          />
        )}
        {panel.recommendedProtocol && (
          <RecommendationCard
            item={panel.recommendedProtocol}
            badge="Protocolo"
            badgeVariant="default"
            source="journey_protocol"
            compact
          />
        )}
        {panel.recommendedLibrary && (
          <RecommendationCard
            item={panel.recommendedLibrary}
            badge="Biblioteca"
            badgeVariant="default"
            source="journey_library"
            compact
          />
        )}
      </div>

      {panel.alsoBenefitFrom.length > 0 && (
        <div className="mt-8">
          <h3 className="font-heading text-lg text-forest">Também pode te ajudar</h3>
          <ul className="mt-4 space-y-3">
            {panel.alsoBenefitFrom.map((suggestion) => (
              <li key={suggestion.id}>
                <Card variant="muted" padding="lg">
                  <p className="text-xs text-muted-light">{suggestion.message}</p>
                  <RecommendationLink
                    item={{
                      id: suggestion.id,
                      type: suggestion.targetType,
                      slug: suggestion.targetSlug,
                      title: suggestion.title,
                      href: suggestion.href,
                      kind: "related",
                    }}
                    source="journey_also_benefit"
                    className="mt-2 group block"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {TYPE_LABELS[suggestion.targetType] ?? suggestion.targetType}
                        </Badge>
                        <p className="mt-2 font-heading text-base text-forest group-hover:text-sage">
                          {suggestion.title}
                        </p>
                        {suggestion.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-muted">
                            {suggestion.description}
                          </p>
                        )}
                      </div>
                      <Icon
                        name="chevron-right"
                        size={18}
                        className="mt-1 shrink-0 text-muted-light group-hover:text-sage"
                      />
                    </div>
                  </RecommendationLink>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function RecommendationCard({
  item,
  badge,
  badgeVariant,
  source,
  featured = false,
  compact = false,
}: {
  item: NonNullable<IntelligentJourneyPanel["recommendationOfTheDay"]>;
  badge: string;
  badgeVariant: "gold" | "forest" | "default";
  source: string;
  featured?: boolean;
  compact?: boolean;
}) {
  return (
    <Card variant={featured ? "featured" : "default"} padding="lg" className="h-full">
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={badgeVariant}>{badge}</Badge>
          <Badge variant="outline">{TYPE_LABELS[item.type] ?? item.type}</Badge>
          {item.isPremium && <Badge variant="gold">Premium</Badge>}
        </div>

        {!compact && (
          <IconBox name="sparkle" size={22} className="mb-4 mt-4 bg-gold-muted" />
        )}

        <RecommendationLink item={item} source={source} className="group block flex-1">
          <h3
            className={`font-heading text-forest group-hover:text-sage ${
              featured ? "text-xl md:text-2xl" : compact ? "mt-3 text-base" : "mt-2 text-lg"
            }`}
          >
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted leading-relaxed">
            {item.description}
          </p>
        </RecommendationLink>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-light">
          <span>{item.reason}</span>
          <span aria-hidden="true">·</span>
          <span>
            {item.level} · ~{item.estimatedMinutes} min
          </span>
        </div>

        <RecommendationLink
          item={item}
          source={source}
          className="mt-4 inline-flex text-sm font-semibold text-forest hover:text-sage"
        >
          Acessar conteúdo →
        </RecommendationLink>
      </div>
    </Card>
  );
}
