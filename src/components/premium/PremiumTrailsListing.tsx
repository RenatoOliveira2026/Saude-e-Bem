"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/icons";
import type { TrailProgress } from "@/lib/premium/trail-progress";
import Link from "next/link";

interface PremiumTrailsListingProps {
  trails: TrailProgress[];
}

export function PremiumTrailsListing({ trails }: PremiumTrailsListingProps) {
  return (
    <div className="space-y-8">
      {trails.map((trail) => (
        <Card
          key={trail.id}
          id={trail.slug}
          variant="default"
          padding="lg"
          className="scroll-mt-24"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-muted text-sage">
                <Icon name={trail.icon} size={24} aria-hidden />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-xl text-forest">{trail.title}</h2>
                  <Badge variant="gold">{trail.durationLabel}</Badge>
                  {trail.isPremium && <Badge variant="sage">Premium</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted">{trail.subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-heading text-2xl font-bold text-forest">
                {trail.percentComplete}%
              </p>
              <p className="text-xs text-muted">
                {trail.completedCount}/{trail.totalSteps} concluídos
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-sage-muted">
            <div
              className="h-full rounded-full bg-sage"
              style={{ width: `${trail.percentComplete}%` }}
            />
          </div>

          <ol className="mt-6 space-y-3">
            {trail.stepsProgress.map((step, index) => (
              <li key={step.id}>
                <Link
                  href={step.href}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                    step.completed
                      ? "border-sage/30 bg-sage-muted/30"
                      : "border-border bg-surface hover:border-sage/40"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      step.completed
                        ? "bg-forest text-off-white"
                        : "border border-border text-muted"
                    }`}
                  >
                    {step.completed ? "✓" : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        step.completed ? "text-muted line-through" : "text-forest"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="mt-0.5 text-xs text-muted">{step.description}</p>
                    )}
                    <p className="mt-1 text-xs capitalize text-muted-light">{step.type}</p>
                  </div>
                  {step.isPremium && (
                    <Badge variant="gold" className="shrink-0 text-xs">
                      Premium
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ol>

          {trail.percentComplete < 100 && (
            <div className="mt-4">
              {(() => {
                const next = trail.stepsProgress.find((s) => !s.completed);
                return next ? (
                  <Button href={next.href} variant="gold" size="sm">
                    Continuar próximo passo
                  </Button>
                ) : null;
              })()}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
