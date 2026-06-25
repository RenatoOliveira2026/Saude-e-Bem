"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/icons";
import type { EngagementSnapshot } from "@/lib/engagement";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface EngagementPanelProps {
  engagement: EngagementSnapshot;
}

export function EngagementPanel({ engagement }: EngagementPanelProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="sage" className="mb-2">
            Engajamento
          </Badge>
          <h2 className="font-heading text-2xl text-forest">Continue sua jornada</h2>
          <p className="mt-1 text-sm text-muted">
            Lembretes e recomendações — sem envio automático por enquanto.
          </p>
        </div>
        <Button href={routes.clubeBeneficios} variant="outline" size="sm">
          Ver benefícios
        </Button>
      </div>

      {engagement.reminders.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {engagement.reminders.slice(0, 4).map((r) => (
            <Card key={r.id} className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gold">
                {r.kind === "trail"
                  ? "Trilha interrompida"
                  : r.kind === "new"
                    ? "Novidade"
                    : r.kind === "weekly"
                      ? "Progresso"
                      : "Continuar"}
              </p>
              <p className="mt-1 font-medium text-forest">{r.title}</p>
              <p className="mt-1 text-sm text-muted">{r.description}</p>
              <Link
                href={r.href}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-forest hover:underline"
              >
                Acessar <Icon name="arrow-right" size={12} />
              </Link>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {engagement.weeklyProgress.map((item) => (
          <Card key={item.label} className="p-4 text-center">
            <p className="text-2xl font-semibold text-forest">
              {item.value}
              <span className="ml-1 text-sm font-normal text-muted">{item.unit}</span>
            </p>
            <p className="mt-1 text-xs text-muted">{item.label}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
