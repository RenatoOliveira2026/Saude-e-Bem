import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ContentAccessEntry } from "@/lib/club/types";
import { routes } from "@/lib/routes";
import Link from "next/link";

const typeLabels: Record<ContentAccessEntry["contentType"], string> = {
  article: "Artigo",
  protocol: "Protocolo",
  ebook: "Biblioteca",
};

interface ClubAccessHistoryListProps {
  entries: ContentAccessEntry[];
}

export function ClubAccessHistoryList({ entries }: ClubAccessHistoryListProps) {
  if (entries.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="font-heading text-xl text-forest">
          Nenhum acesso registrado
        </h2>
        <p className="mt-3 text-muted">
          Ao visitar artigos, protocolos e materiais da biblioteca, seu histórico
          aparecerá aqui.
        </p>
        <Button href={routes.blog} variant="outline" size="sm" className="mt-6">
          Explorar conteúdo
        </Button>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Card className="p-4 transition-shadow hover:shadow-soft">
            <Link
              href={entry.href}
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <p className="font-heading font-semibold text-forest">
                  {entry.contentTitle}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {typeLabels[entry.contentType]}
                  {entry.sourcePath && (
                    <span className="text-muted-light">
                      {" "}
                      · {entry.sourcePath}
                    </span>
                  )}
                </p>
              </div>
              <span className="text-xs text-muted-light">
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(entry.createdAt))}
              </span>
            </Link>
          </Card>
        </li>
      ))}
    </ul>
  );
}
