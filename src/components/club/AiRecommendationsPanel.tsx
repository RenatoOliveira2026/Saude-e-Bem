import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ClubRecommendation } from "@/lib/club/types";
import Link from "next/link";

const kindLabels: Record<NonNullable<ClubRecommendation["kind"]>, string> = {
  continue_reading: "Continuar",
  personalized: "Para você",
  trending: "Em alta",
  related: "Relacionado",
};

interface AiRecommendationsPanelProps {
  recommendations: ClubRecommendation[];
  title?: string;
  showKind?: boolean;
}

export function AiRecommendationsPanel({
  recommendations,
  title = "Recomendações IA",
  showKind = true,
}: AiRecommendationsPanelProps) {
  if (recommendations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="font-heading text-xl text-forest">{title}</h2>
        <p className="mt-3 text-muted">
          Navegue pelo conteúdo e complete seu perfil para receber sugestões
          inteligentes.
        </p>
      </Card>
    );
  }

  const typeLabels: Record<ClubRecommendation["contentType"], string> = {
    protocol: "Protocolo",
    ebook: "Biblioteca",
    article: "Artigo",
  };

  return (
    <section>
      {title ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-xl text-forest">{title}</h2>
          <Badge variant="gold">IA</Badge>
        </div>
      ) : null}
      <ul className="grid gap-4 sm:grid-cols-2">
        {recommendations.map((item) => (
          <li key={`${item.contentType}-${item.id}-${item.kind ?? "rec"}`}>
            <Card className="flex h-full flex-col p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">{typeLabels[item.contentType]}</Badge>
                {item.isPremium && <Badge variant="gold">Premium</Badge>}
                {showKind && item.kind && (
                  <Badge variant="forest">{kindLabels[item.kind]}</Badge>
                )}
              </div>
              <Link href={item.href} className="mt-3 block group">
                <h3 className="font-heading text-lg text-forest group-hover:text-sage">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {item.description || item.reason}
                </p>
              </Link>
              <p className="mt-auto pt-3 text-xs text-muted-light">
                {item.reason}
                {item.score != null && ` · Score ${item.score.toFixed(0)}`}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
