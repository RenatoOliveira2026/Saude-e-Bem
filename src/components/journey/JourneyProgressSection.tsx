import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/icons";
import type { JourneyProgressStats } from "@/lib/journey/types";
import { routes } from "@/lib/routes";

interface JourneyProgressSectionProps {
  progress: JourneyProgressStats;
}

export function JourneyProgressSection({ progress }: JourneyProgressSectionProps) {
  return (
    <Card variant="featured" padding="lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-widest text-sage">
            Seu progresso
          </p>
          <h2 className="mt-2 font-heading text-2xl text-forest">
            {progress.overallPercent}% da jornada premium
          </h2>
          <p className="mt-2 text-sm text-muted">
            Acompanhe trilhas, protocolos e materiais concluídos.
          </p>
        </div>
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-gold/40 bg-gold-muted/30">
          <span className="font-heading text-2xl font-bold text-forest">
            {progress.overallPercent}%
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProgressStat
          icon="plan"
          label="Trilhas iniciadas"
          value={progress.trailsStarted}
        />
        <ProgressStat
          icon="checklist"
          label="Trilhas concluídas"
          value={progress.trailsCompleted}
        />
        <ProgressStat
          icon="sparkle"
          label="Protocolos em andamento"
          value={progress.protocolsStarted}
        />
        <ProgressStat
          icon="library"
          label="Materiais acessados"
          value={progress.materialsCompleted}
        />
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-sage-muted">
        <div
          className="h-full rounded-full bg-sage transition-all"
          style={{ width: `${Math.min(100, progress.overallPercent)}%` }}
          role="progressbar"
          aria-valuenow={progress.overallPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button href={routes.clubeTrilhas} variant="primary" size="sm">
          Ver trilhas premium
        </Button>
        <Button href={routes.clubeBeneficios} variant="outline" size="sm">
          Benefícios exclusivos
        </Button>
      </div>
    </Card>
  );
}

function ProgressStat({
  icon,
  label,
  value,
}: {
  icon: "plan" | "checklist" | "sparkle" | "library";
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <div className="flex items-center gap-2 text-muted">
        <Icon name={icon} size={16} aria-hidden />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 font-heading text-2xl font-semibold text-forest">{value}</p>
    </div>
  );
}
