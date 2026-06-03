import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ContinueReadingItem } from "@/lib/club/types";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface ContinueReadingSectionProps {
  items: ContinueReadingItem[];
  compact?: boolean;
}

export function ContinueReadingSection({
  items,
  compact = false,
}: ContinueReadingSectionProps) {
  if (items.length === 0) {
    if (compact) return null;
    return (
      <Card className="p-6 text-center">
        <h2 className="font-heading text-lg text-forest">Continuar lendo</h2>
        <p className="mt-2 text-sm text-muted">
          Seus conteúdos recentes aparecerão aqui conforme você navega.
        </p>
        <Button href={routes.blog} variant="outline" size="sm" className="mt-4">
          Explorar conteúdo
        </Button>
      </Card>
    );
  }

  return (
    <section>
      {!compact && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl text-forest">Continuar lendo</h2>
          <Link
            href={routes.clubeHistorico}
            className="text-sm text-sage hover:underline"
          >
            Ver histórico
          </Link>
        </div>
      )}
      <ul className={compact ? "space-y-2" : "space-y-3"}>
        {items.map((item) => (
          <li key={item.id}>
            <Card className="p-4 transition-shadow hover:shadow-soft">
              <Link href={item.href} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-forest">{item.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    {item.accessCount} acesso(s) ·{" "}
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                    }).format(new Date(item.lastAccessedAt))}
                  </p>
                </div>
                <Badge variant="gold">Continuar</Badge>
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
