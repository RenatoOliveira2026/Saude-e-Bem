import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ContentCover } from "@/components/content/ContentCover";
import { Icon, IconBox, type IconName } from "@/components/icons";
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
  const actionHref = item.isPremium
    ? routes.assinar
    : routes.bibliotecaItem(item.slug);
  const actionLabel = item.isPremium ? "Assinar para acessar" : "Acessar conteúdo";

  return (
    <Card variant="default" hover padding="lg" className="flex h-full flex-col">
      <ContentCover src={item.image} alt={item.title} className="mb-4 aspect-[4/3] w-full">
        <IconBox name={typeIcons[item.type]} size={28} />
      </ContentCover>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={item.isPremium ? "gold" : "sage"}>
          {item.isPremium ? "Premium" : "Gratuito"}
        </Badge>
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

      <div className="mt-6 border-t border-border pt-4">
        <Button
          href={actionHref}
          variant={item.isPremium ? "secondary" : "outline"}
          size="sm"
          className="w-full justify-center gap-2"
        >
          {item.isPremium && <Icon name="lock" size={16} />}
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
}

export function FeaturedIntelligentLibraryBanner({ item }: { item: LibraryItem }) {
  const actionHref = item.isPremium
    ? routes.assinar
    : routes.bibliotecaItem(item.slug);
  const actionLabel = item.isPremium ? "Assinar para acessar" : "Acessar conteúdo";

  return (
    <Card variant="featured" padding="lg">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div>
          <IconBox name={typeIcons[item.type]} size={24} className="mb-4 bg-gold-muted" />
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant={item.isPremium ? "gold" : "sage"}>
              {item.isPremium ? "Premium" : "Gratuito"}
            </Badge>
            <Badge variant="default">{item.category}</Badge>
          </div>
          <h2 className="font-heading text-2xl text-forest">{item.title}</h2>
          <p className="mt-3 text-muted leading-relaxed text-pretty">{item.description}</p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <p className="text-sm text-muted">
            {typeLabels[item.type]} · {item.estimatedReadTime}
          </p>
          <Button href={actionHref} size="lg" variant={item.isPremium ? "secondary" : "primary"}>
            {actionLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}
