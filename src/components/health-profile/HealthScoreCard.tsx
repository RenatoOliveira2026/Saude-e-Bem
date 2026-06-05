import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { HealthScoreResult } from "@/lib/recommendations/recommendation-types";
import { cn } from "@/lib/cn";

const levelBadgeVariant: Record<
  HealthScoreResult["level"],
  "sage" | "gold" | "outline" | "forest"
> = {
  iniciante: "outline",
  evolucao: "gold",
  bom: "sage",
  excelente: "forest",
};

export function HealthScoreCard({ score }: { score: HealthScoreResult }) {
  return (
    <Card variant="outline" padding="lg" className="overflow-hidden">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-6">
          <div
            className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-sage bg-sage-muted"
            role="img"
            aria-label={`Score ${score.percentage} de 100`}
          >
            <span className="font-heading text-3xl text-forest">{score.percentage}</span>
          </div>
          <div>
            <p className="font-heading text-sm font-semibold uppercase tracking-wider text-muted">
              Seu Score Saúde & Bem
            </p>
            <p className="mt-2 font-heading text-2xl text-forest">
              {score.total} / {score.maxTotal} pontos
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant={levelBadgeVariant[score.level]}>{score.levelLabel}</Badge>
              <span className="text-xs text-muted">
                {score.toolsUsed} de {score.toolsTotal} ferramentas com registro
              </span>
            </div>
          </div>
        </div>
        <p className="max-w-md text-sm text-muted text-pretty lg:text-right">
          {score.summary}
        </p>
      </div>

      <div className="mt-8 h-2 overflow-hidden rounded-full bg-sage-muted">
        <div
          className="h-full rounded-full bg-sage transition-all"
          style={{ width: `${score.percentage}%` }}
        />
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {score.criteria.map((criterion) => (
          <li
            key={criterion.id}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              criterion.met
                ? "border-sage/40 bg-sage-muted/40"
                : "border-border bg-surface",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-forest">{criterion.label}</span>
              <span className="shrink-0 text-xs text-muted">
                {criterion.points}/{criterion.maxPoints}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted text-pretty">{criterion.detail}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
