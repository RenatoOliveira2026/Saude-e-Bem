"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { updateSavedProtocolStatusAction } from "@/lib/club/actions/saved-protocol.actions";
import type { ResolvedSavedProtocol, SavedProtocolStatus } from "@/lib/club/types";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statusLabels: Record<SavedProtocolStatus, string> = {
  saved: "Salvo",
  in_progress: "Em andamento",
  completed: "Concluído",
};

interface ClubSavedProtocolsListProps {
  protocols: ResolvedSavedProtocol[];
}

export function ClubSavedProtocolsList({ protocols }: ClubSavedProtocolsListProps) {
  if (protocols.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="font-heading text-xl text-forest">
          Nenhum protocolo salvo
        </h2>
        <p className="mt-3 text-muted">
          Salve protocolos para acompanhar seu progresso na área premium.
        </p>
        <Button href={routes.protocolos} variant="gold" size="sm" className="mt-6">
          Explorar protocolos
        </Button>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {protocols.map((item) => (
        <SavedProtocolRow key={item.id} item={item} />
      ))}
    </ul>
  );
}

function SavedProtocolRow({ item }: { item: ResolvedSavedProtocol }) {
  const router = useRouter();
  const [status, setStatus] = useState(item.status);
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(next: SavedProtocolStatus) {
    setLoading(true);
    const result = await updateSavedProtocolStatusAction({
      protocolId: item.protocolId,
      status: next,
    });
    if (result.ok) {
      setStatus(next);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <li>
      <Card className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Link
              href={item.href}
              className="font-heading font-semibold text-forest hover:text-sage"
            >
              {item.title}
            </Link>
            <p className="mt-1 text-sm text-muted">
              {item.categoryLabel ?? "Protocolo"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {item.isPremium && <Badge variant="gold">Premium</Badge>}
            <Badge variant="default">{statusLabels[status]}</Badge>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["saved", "in_progress", "completed"] as SavedProtocolStatus[]).map(
            (value) => (
              <button
                key={value}
                type="button"
                disabled={loading || status === value}
                onClick={() => handleStatusChange(value)}
                className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  status === value
                    ? "bg-sage-muted font-medium text-forest"
                    : "bg-surface-muted text-muted hover:text-forest"
                }`}
              >
                {statusLabels[value]}
              </button>
            ),
          )}
        </div>
      </Card>
    </li>
  );
}
