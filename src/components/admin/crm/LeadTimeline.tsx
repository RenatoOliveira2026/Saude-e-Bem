import type { LeadInteractionRecord } from "@/lib/crm/types";

interface LeadTimelineProps {
  interactions: LeadInteractionRecord[];
}

const EVENT_LABELS: Record<string, string> = {
  lead_captured: "Captura",
  lead_recaptured: "Reengajamento",
  score_upgraded: "Score",
  sequence_started: "Automação",
  sequence_step_sent: "E-mail",
  sequence_step_scheduled: "Agendado",
  sequence_completed: "Concluído",
  sequence_failed: "Falha",
  esp_synced: "ESP",
  esp_sync_failed: "ESP",
};

export function LeadTimeline({ interactions }: LeadTimelineProps) {
  if (interactions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
        Nenhuma interação registrada ainda.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {interactions.map((item) => (
        <li
          key={item.id}
          className="relative rounded-xl border border-border bg-surface px-4 py-3 shadow-soft"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                {EVENT_LABELS[item.eventType] ?? item.eventType}
              </p>
              <p className="mt-1 font-medium text-forest">{item.title}</p>
              {item.description && (
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              )}
            </div>
            <time className="text-xs text-muted-light">
              {new Date(item.createdAt).toLocaleString("pt-BR")}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}
