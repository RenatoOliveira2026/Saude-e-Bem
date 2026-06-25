import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/icons";
import type { TrailProgress } from "@/lib/premium/trail-progress";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { JourneySectionHeader } from "./JourneySectionHeader";

interface JourneyTrailsSectionProps {
  trails: TrailProgress[];
  activeTrail: TrailProgress | null;
}

export function JourneyTrailsSection({ trails, activeTrail }: JourneyTrailsSectionProps) {
  const preview = activeTrail
    ? [activeTrail, ...trails.filter((t) => t.id !== activeTrail.id).slice(0, 2)]
    : trails.slice(0, 3);

  return (
    <>
      <JourneySectionHeader
        title="Trilhas Premium"
        description="Percursos organizados por objetivo — artigos, protocolos, biblioteca e checklists."
        href={routes.clubeTrilhas}
        linkLabel="Ver todas"
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {preview.map((trail) => (
          <TrailCard key={trail.id} trail={trail} highlighted={trail.id === activeTrail?.id} />
        ))}
      </div>
      {activeTrail && activeTrail.percentComplete < 100 && (
        <Card variant="muted" padding="lg" className="mt-6">
          <p className="text-sm font-medium text-forest">Continue: {activeTrail.title}</p>
          <ul className="mt-4 space-y-2">
            {activeTrail.stepsProgress.slice(0, 4).map((step) => (
              <li key={step.id} className="flex items-center gap-2 text-sm">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                    step.completed
                      ? "bg-forest text-off-white"
                      : "border border-border text-muted-light"
                  }`}
                >
                  {step.completed ? "✓" : ""}
                </span>
                <Link
                  href={step.href}
                  className={
                    step.completed ? "text-muted line-through" : "text-forest hover:text-sage"
                  }
                >
                  {step.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href={routes.clubeTrilhas} variant="gold" size="sm" className="mt-4">
            Continuar trilha
          </Button>
        </Card>
      )}
    </>
  );
}

function TrailCard({
  trail,
  highlighted,
}: {
  trail: TrailProgress;
  highlighted?: boolean;
}) {
  return (
    <Card
      variant={highlighted ? "featured" : "default"}
      hover
      padding="lg"
      className="flex h-full flex-col"
    >
      <div className="flex items-start justify-between gap-2">
        <Icon name={trail.icon} size={22} className="text-sage" />
        <Badge variant={trail.isPremium ? "gold" : "sage"}>{trail.durationLabel}</Badge>
      </div>
      <h3 className="mt-4 font-heading text-lg text-forest">{trail.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{trail.subtitle}</p>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted">
          <span>Progresso</span>
          <span>{trail.percentComplete}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sage-muted">
          <div
            className="h-full rounded-full bg-sage"
            style={{ width: `${trail.percentComplete}%` }}
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-light">
        {trail.completedCount}/{trail.totalSteps} passos
      </p>
      <Button
        href={`${routes.clubeTrilhas}#${trail.slug}`}
        variant="outline"
        size="sm"
        className="mt-4 w-full justify-center"
      >
        Ver trilha
      </Button>
    </Card>
  );
}
