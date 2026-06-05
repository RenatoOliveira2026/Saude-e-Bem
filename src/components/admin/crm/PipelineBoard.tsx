import { Badge } from "@/components/ui/Badge";
import type { PipelineColumn } from "@/lib/crm/types";
import { LEAD_SOURCE_LABELS } from "@/lib/leads/lead.constants";
import { leadScoreBadgeVariant } from "@/lib/leads/lead-score";
import { adminRoutes } from "@/lib/routes";
import Link from "next/link";

interface PipelineBoardProps {
  columns: PipelineColumn[];
}

export function PipelineBoard({ columns }: PipelineBoardProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {columns.map((column) => (
        <div
          key={column.score}
          className="rounded-2xl border border-border bg-surface p-4 shadow-soft"
        >
          <div className="mb-4 flex items-center justify-between">
            <Badge variant={leadScoreBadgeVariant(column.score)}>{column.label}</Badge>
            <span className="text-sm font-medium text-muted">{column.count}</span>
          </div>
          <ul className="space-y-2">
            {column.leads.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={adminRoutes.leadDetail(lead.id)}
                  className="block rounded-xl border border-border/60 bg-off-white px-3 py-2 transition-colors hover:border-sage hover:bg-sage-muted/20"
                >
                  <p className="truncate text-sm font-medium text-forest">
                    {lead.name ?? lead.email}
                  </p>
                  <p className="truncate text-xs text-muted">{lead.email}</p>
                  <p className="mt-1 text-xs text-muted-light">
                    {LEAD_SOURCE_LABELS[lead.source] ?? lead.source}
                  </p>
                </Link>
              </li>
            ))}
            {column.leads.length === 0 && (
              <li className="py-6 text-center text-xs text-muted">Nenhum lead nesta etapa</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
