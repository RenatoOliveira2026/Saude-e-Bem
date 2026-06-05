import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/icons";
import type { HealthRecommendation } from "@/lib/health-profile/types";
import { routes } from "@/lib/routes";
import Link from "next/link";

export function HealthRecommendations({
  recommendations,
}: {
  recommendations: HealthRecommendation[];
}) {
  if (recommendations.length === 0) {
    return (
      <p className="text-sm text-muted">
        Complete ferramentas ou o quiz para receber recomendações de protocolos.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((rec) => (
        <Card key={rec.protocolSlug} variant="outline" padding="md" hover>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {rec.priority != null && (
                <Badge variant="sage">Prioridade {rec.priority}</Badge>
              )}
              <Badge variant="default">{rec.categoryLabel}</Badge>
            </div>
            {rec.isPremium && <Badge variant="gold">Premium</Badge>}
          </div>
          <h3 className="mt-3 font-heading text-lg text-forest">{rec.protocolTitle}</h3>
          {rec.description && (
            <p className="mt-2 text-sm text-muted text-pretty line-clamp-2">
              {rec.description}
            </p>
          )}
          <p className="mt-2 text-sm text-forest/80 text-pretty">{rec.reason}</p>
          <Link
            href={rec.href}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-sage"
          >
            Ver protocolo
            <Icon name="arrow-right" size={16} />
          </Link>
        </Card>
      ))}
      <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
        <Button href={routes.protocolos} variant="secondary" size="md">
          Biblioteca de protocolos
        </Button>
        <Button href={routes.protocolosPainel} variant="outline" size="md">
          Painel inteligente
        </Button>
      </div>
    </div>
  );
}
