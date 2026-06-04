import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/icons";
import { historyEntryHref } from "@/lib/protocol-library/services/history.service";
import type { ProtocolHistoryEntry } from "@/lib/protocol-library/types";
import Link from "next/link";

interface ProtocolHistoryListProps {
  entries: ProtocolHistoryEntry[];
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ProtocolHistoryList({ entries }: ProtocolHistoryListProps) {
  if (entries.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Icon name="clock" size={32} className="mx-auto text-sage" />
        <p className="mt-4 text-muted">
          Você ainda não visualizou protocolos. Explore a biblioteca e volte aqui.
        </p>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <Link
                href={historyEntryHref(entry)}
                className="font-heading text-lg text-forest hover:text-sage-dark"
              >
                {entry.protocolTitle}
              </Link>
              <p className="mt-1 text-sm text-muted">
                Último acesso: {formatDate(entry.lastViewedAt)}
                {entry.viewCount > 1 && (
                  <> · {entry.viewCount} visualizações</>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {entry.isPremium && <Badge variant="gold">Premium</Badge>}
              <Badge variant="outline">Protocolo</Badge>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
