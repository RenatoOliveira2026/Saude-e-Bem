import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ContentCover } from "@/components/content/ContentCover";
import { IconBox } from "@/components/icons";
import { routes } from "@/lib/routes";
import type { LibraryResource } from "@/lib/data/types";

export function LibraryCard({ resource }: { resource: LibraryResource }) {
  return (
    <Card variant="default" hover padding="lg" className="flex h-full flex-col">
      <ContentCover src={resource.coverImageUrl} alt={resource.title} className="mb-4 h-20">
        <IconBox name={resource.icon} size={22} />
      </ContentCover>
      <Badge variant="default">{resource.categoryLabel}</Badge>
      <CardHeader className="mb-0 mt-4 flex-1">
        <CardTitle className="text-lg">{resource.title}</CardTitle>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          {resource.description}
        </CardDescription>
      </CardHeader>
      <p className="text-xs text-muted-light">
        {resource.format} · {resource.pages} páginas
      </p>
      <div className="mt-6 border-t border-border pt-4">
        <Button
          href={routes.bibliotecaItem(resource.slug)}
          variant="outline"
          size="sm"
          className="w-full justify-center"
        >
          Baixar gratuito
        </Button>
      </div>
    </Card>
  );
}

export function FeaturedLibraryBanner({
  resource,
}: {
  resource: LibraryResource;
}) {
  return (
    <Card variant="featured" padding="lg">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div>
          <IconBox name={resource.icon} size={24} className="mb-4 bg-gold-muted" />
          <Badge variant="gold" className="mb-3">
            Material gratuito
          </Badge>
          <h2 className="font-heading text-2xl text-forest">{resource.title}</h2>
          <p className="mt-3 text-muted leading-relaxed">{resource.description}</p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <p className="text-sm text-muted">
            {resource.format} · {resource.pages} páginas ·{" "}
            {resource.downloads.toLocaleString("pt-BR")} downloads
          </p>
          <Button href={routes.bibliotecaItem(resource.slug)} size="lg">
            Baixar gratuito
          </Button>
        </div>
      </div>
    </Card>
  );
}
