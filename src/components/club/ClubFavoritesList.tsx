import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ResolvedFavorite } from "@/lib/club/types";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface ClubFavoritesListProps {
  favorites: ResolvedFavorite[];
}

export function ClubFavoritesList({ favorites }: ClubFavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="font-heading text-xl text-forest">Nenhum favorito ainda</h2>
        <p className="mt-3 text-muted">
          Salve artigos, protocolos e materiais da biblioteca para acessá-los
          rapidamente aqui.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href={routes.blog} variant="outline" size="sm">
            Ver blog
          </Button>
          <Button href={routes.protocolos} variant="primary" size="sm">
            Ver protocolos
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {favorites.map((item) => (
        <li key={item.id}>
          <Card className="p-4 transition-shadow hover:shadow-soft">
            <Link href={item.href} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-heading font-semibold text-forest">{item.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {item.categoryLabel ?? item.contentType}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {item.isPremium && <Badge variant="gold">Premium</Badge>}
                <span className="text-xs text-muted-light">
                  {new Intl.DateTimeFormat("pt-BR").format(new Date(item.createdAt))}
                </span>
              </div>
            </Link>
          </Card>
        </li>
      ))}
    </ul>
  );
}
