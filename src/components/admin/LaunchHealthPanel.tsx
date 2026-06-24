import { Badge } from "@/components/ui/Badge";
import type { HealthCheckItem, HealthStatus } from "@/lib/admin/services/system-health.service";

const statusConfig: Record<
  HealthStatus,
  { label: string; variant: "sage" | "gold" | "default" | "forest" }
> = {
  ok: { label: "OK", variant: "sage" },
  warning: { label: "Atenção", variant: "gold" },
  pending: { label: "Pendente", variant: "default" },
  error: { label: "Erro", variant: "gold" },
};

interface LaunchHealthPanelProps {
  checkedAt: string;
  overall: HealthStatus;
  items: HealthCheckItem[];
}

export function LaunchHealthPanel({ checkedAt, overall, items }: LaunchHealthPanelProps) {
  const overallCfg = statusConfig[overall];

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-forest">
            Saúde do sistema
          </h2>
          <p className="mt-1 text-sm text-muted">
            Verificação automática —{" "}
            {new Date(checkedAt).toLocaleString("pt-BR")}
          </p>
        </div>
        <Badge variant={overallCfg.variant}>Geral: {overallCfg.label}</Badge>
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const cfg = statusConfig[item.status];
          return (
            <li
              key={item.id}
              className="rounded-xl border border-border bg-off-white p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-forest">{item.label}</span>
                <Badge variant={cfg.variant}>{cfg.label}</Badge>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">{item.detail}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
