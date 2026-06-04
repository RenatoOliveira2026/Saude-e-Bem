import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { routes } from "@/lib/routes";
import type { ToolResultSummary } from "@/lib/health-profile/types";
import { formatHealthDate } from "@/lib/health-profile/services/tool-results.service";
import Link from "next/link";

export function ToolResultSummaryCard({ summary }: { summary: ToolResultSummary }) {
  return (
    <Card variant="muted" padding="lg" hover className="flex h-full flex-col">
      <Badge variant="outline">{summary.toolTitle}</Badge>
      <p className="mt-4 font-heading text-xl text-forest">{summary.summary}</p>
      {summary.detail && (
        <p className="mt-2 text-sm text-muted text-pretty line-clamp-2">
          {summary.detail}
        </p>
      )}
      <p className="mt-auto pt-6 text-xs text-muted-light">
        {formatHealthDate(summary.recordedAt)}
      </p>
      <div className="mt-4 border-t border-border pt-4">
        <Button
          href={routes.ferramenta(summary.toolSlug)}
          variant="secondary"
          size="sm"
          className="w-full justify-center"
        >
          Refazer ferramenta
        </Button>
      </div>
    </Card>
  );
}

export function ToolResultSummaryGrid({
  summaries,
}: {
  summaries: ToolResultSummary[];
}) {
  if (summaries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border-strong bg-sage-muted/30 px-6 py-12 text-center">
        <p className="font-heading text-lg text-forest">Nenhum resultado salvo ainda</p>
        <p className="mt-2 text-sm text-muted text-pretty">
          Use as ferramentas gratuitas estando logado(a). Seus resultados aparecerão
          aqui automaticamente.
        </p>
        <Button href={routes.ferramentas} variant="primary" size="md" className="mt-6">
          Explorar ferramentas
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {summaries.map((summary) => (
        <ToolResultSummaryCard key={summary.toolSlug} summary={summary} />
      ))}
    </div>
  );
}

export function ToolHistoryList({
  history,
}: {
  history: Array<{
    id: string;
    toolSlug: string;
    toolTitle: string;
    summary: string;
    createdAt: string;
  }>;
}) {
  if (history.length === 0) return null;

  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
      {history.map((item) => (
        <li
          key={item.id}
          className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
        >
          <div className="min-w-0">
            <p className="font-heading text-sm font-semibold text-forest">
              {item.toolTitle}
            </p>
            <p className="mt-1 text-sm text-muted">{item.summary}</p>
            <p className="mt-1 text-xs text-muted-light">
              {formatHealthDate(item.createdAt)}
            </p>
          </div>
          <Link
            href={routes.ferramenta(item.toolSlug)}
            className="text-sm font-medium text-forest underline-offset-2 hover:underline"
          >
            Abrir ferramenta
          </Link>
        </li>
      ))}
    </ul>
  );
}
