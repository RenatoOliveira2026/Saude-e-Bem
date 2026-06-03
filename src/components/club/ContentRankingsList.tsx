import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ContentRankingItem } from "@/lib/club/types";
import Link from "next/link";

interface ContentRankingsListProps {
  rankings: ContentRankingItem[];
  title?: string;
}

export function ContentRankingsList({
  rankings,
  title = "Ranking de conteúdos",
}: ContentRankingsListProps) {
  if (rankings.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h2 className="font-heading text-lg text-forest">{title}</h2>
        <p className="mt-2 text-sm text-muted">
          Rankings serão atualizados conforme a comunidade interage com o
          conteúdo.
        </p>
      </Card>
    );
  }

  const typeLabels: Record<ContentRankingItem["contentType"], string> = {
    article: "Artigo",
    protocol: "Protocolo",
    ebook: "Biblioteca",
  };

  return (
    <section>
      <h2 className="mb-4 font-heading text-xl text-forest">{title}</h2>
      <ol className="space-y-3">
        {rankings.map((item) => (
          <li key={item.id}>
            <Card className="p-4">
              <Link
                href={item.href}
                className="flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-muted font-heading text-sm text-forest">
                    {item.rankPosition}
                  </span>
                  <div>
                    <p className="font-medium text-forest">{item.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {typeLabels[item.contentType]} · {item.viewCount} views ·{" "}
                      {item.downloadCount} downloads
                    </p>
                  </div>
                </div>
                <Badge variant="default">Score {item.score.toFixed(0)}</Badge>
              </Link>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
}
