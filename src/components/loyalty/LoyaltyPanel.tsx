"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon, IconBox } from "@/components/icons";
import type { LoyaltySnapshot } from "@/lib/loyalty";

interface LoyaltyPanelProps {
  loyalty: LoyaltySnapshot;
}

export function LoyaltyPanel({ loyalty }: LoyaltyPanelProps) {
  const unlocked = loyalty.achievements.filter((a) => a.unlocked);

  return (
    <section className="space-y-6">
      <div>
        <Badge variant="gold" className="mb-2">
          Fidelização
        </Badge>
        <h2 className="font-heading text-2xl text-forest">Suas conquistas</h2>
        <p className="mt-1 text-sm text-muted">
          Medalhas e metas pessoais — progresso privado, sem ranking público.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4 text-center">
          <p className="text-3xl font-semibold text-forest">{loyalty.dayStreak}</p>
          <p className="text-sm text-muted">dias de sequência</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-semibold text-forest">{loyalty.unlockedCount}</p>
          <p className="text-sm text-muted">medalhas desbloqueadas</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-semibold text-forest">{loyalty.monthlyProgressPercent}%</p>
          <p className="text-sm text-muted">progresso do mês</p>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {loyalty.achievements.map((a) => (
          <Card
            key={a.id}
            className={`p-4 ${a.unlocked ? "border-gold/40 bg-gold-muted/20" : "opacity-60"}`}
          >
            <IconBox name={a.icon} size={20} className={a.unlocked ? "bg-gold-muted" : ""} />
            <p className="mt-3 font-medium text-forest">{a.title}</p>
            <p className="mt-1 text-xs text-muted">{a.description}</p>
            {a.unlocked && (
              <Badge variant="gold" className="mt-2">
                {a.medalLabel}
              </Badge>
            )}
          </Card>
        ))}
      </div>

      <div>
        <h3 className="font-heading text-lg text-forest">Metas pessoais</h3>
        <div className="mt-4 space-y-3">
          {loyalty.personalGoals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
            return (
              <div key={goal.id}>
                <div className="flex justify-between text-sm">
                  <span className="text-forest">{goal.label}</span>
                  <span className="text-muted">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-sage-muted">
                  <div
                    className="h-full rounded-full bg-forest transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {unlocked.length > 0 && (
        <p className="flex items-center gap-2 text-sm text-muted">
          <Icon name="star" size={14} className="text-gold" />
          {unlocked.length} de {loyalty.achievements.length} conquistas — continue assim!
        </p>
      )}
    </section>
  );
}
