import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ContentCover } from "@/components/content/ContentCover";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import { IconBox, type IconName } from "@/components/icons";
import type { LibraryItem } from "@/lib/intelligent-library";
import { routes } from "@/lib/routes";

const typeIcons: Record<LibraryItem["type"], IconName> = {
  ebook: "book",
  pdf: "download",
  protocolo: "sparkle",
  video: "live",
  affiliate: "star",
};

const typeLabels: Record<LibraryItem["type"], string> = {
  ebook: "E-book",
  pdf: "PDF",
  protocolo: "Protocolo",
  video: "Vídeo",
  affiliate: "Afiliado",
};

interface IntelligentLibraryCardProps {
  item: LibraryItem;
}

export function IntelligentLibraryCard({ item }: IntelligentLibraryCardProps) {
  return (
    <Card variant="default" hover padding="lg" className="flex h-full flex-col">
      <ContentCover src={item.image} alt={item.title} className="mb-4 aspect-[4/3] w-full">
        <IconBox name={typeIcons[item.type]} size={28} />
      </ContentCover>

      <div className="flex flex-wrap items-center gap-2">
        <PlanBadge tier={item.isPremium ? "premium" : "free"} />
        <Badge variant="default">{item.category}</Badge>
      </div>

      <CardHeader className="mb-0 mt-4 flex-1">
        <CardTitle className="text-lg">{item.title}</CardTitle>
        <CardDescription className="mt-2 text-sm leading-relaxed text-pretty">
          {item.description}
        </CardDescription>
      </CardHeader>

      <p className="mt-4 text-xs text-muted-light">
        {typeLabels[item.type]} · {item.estimatedReadTime}
      </p>

      {item.isPremium ? (
        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-3 text-sm text-forest/80">🔒 Exclusivo para assinantes</p>
          <Button
            href={routes.assinar}
            variant="gold"
            size="sm"
            className="w-full justify-center"
          >
            Assinar agora
          </Button>
        </div>
      ) : (
        <div className="mt-6 border-t border-border pt-4">
          <Button
            href={routes.bibliotecaItem(item.slug)}
            variant="outline"
            size="sm"
            className="w-full justify-center"
          >
            Acessar conteúdo
          </Button>
        </div>
      )}
    </Card>
  );
}

export function FeaturedIntelligentLibraryBanner({ item }: { item: LibraryItem }) {
  return (
    <Card variant="featured" padding="lg">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div>
          <IconBox name={typeIcons[item.type]} size={24} className="mb-4 bg-gold-muted" />
          <div className="mb-3 flex flex-wrap gap-2">
            <PlanBadge tier={item.isPremium ? "premium" : "free"} />
            <Badge variant="default">{item.category}</Badge>
          </div>
          <h2 className="font-heading text-2xl text-forest">{item.title}</h2>
          <p className="mt-3 text-muted leading-relaxed text-pretty">{item.description}</p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <p className="text-sm text-muted">
            {typeLabels[item.type]} · {item.estimatedReadTime}
          </p>
          {item.isPremium ? (
            <>
              <p className="text-sm text-forest/80">🔒 Exclusivo para assinantes</p>
              <Button href={routes.assinar} size="lg" variant="gold">
                Assinar agora
              </Button>
            </>
          ) : (
            <Button href={routes.bibliotecaItem(item.slug)} size="lg" variant="primary">
              Acessar conteúdo
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
