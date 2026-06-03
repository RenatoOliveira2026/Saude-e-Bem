import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ClubRecommendation } from "@/lib/club/types";
import { routes } from "@/lib/routes";
import Link from "next/link";

const typeLabels: Record<ClubRecommendation["contentType"], string> = {
  protocol: "Protocolo",
  ebook: "Biblioteca",
  article: "Artigo",
};

interface ClubRecommendationsListProps {
  recommendations: ClubRecommendation[];
  compact?: boolean;
}

export function ClubRecommendationsList({
  recommendations,
  compact = false,
}: ClubRecommendationsListProps) {
  if (recommendations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="font-heading text-xl text-forest">
          Recomendações em breve
        </h2>
        <p className="mt-3 text-muted">
          Complete seu perfil em Minha Jornada para receber sugestões
          personalizadas.
        </p>
        <Button href={routes.minhaJornada} variant="outline" size="sm" className="mt-6">
          Ir à Minha Jornada
        </Button>
      </Card>
    );
  }

  return (
    <ul className={compact ? "space-y-3" : "grid gap-4 sm:grid-cols-2"}>
      {recommendations.map((item) => (
        <li key={`${item.contentType}-${item.id}`}>
          <Card className={`h-full p-5 ${compact ? "" : "flex flex-col"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">{typeLabels[item.contentType]}</Badge>
              {item.isPremium && <Badge variant="gold">Premium</Badge>}
            </div>
            <Link href={item.href} className="mt-3 block group">
              <h3 className="font-heading text-lg text-forest group-hover:text-sage">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">
                {item.description}
              </p>
            </Link>
            <p className="mt-3 text-xs text-muted-light">{item.reason}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
