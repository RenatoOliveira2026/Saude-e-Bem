import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ContentCover } from "@/components/content/ContentCover";
import { IconBox } from "@/components/icons";
import { Section } from "@/components/ui/Section";
import { HomeEmptyNote } from "@/components/home/HomeEmptyNote";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import type { LibraryResource } from "@/lib/data/types";
import { routes } from "@/lib/routes";

interface LibraryPremiumSectionProps {
  resources: LibraryResource[];
}

export function LibraryPremiumSection({ resources }: LibraryPremiumSectionProps) {
  return (
    <Section background="white" id="biblioteca" spacing="spacious">
      <HomeSectionHeader
        label="Biblioteca"
        title="Biblioteca gratuita"
        description="Guias, checklists e materiais curados para você começar hoje — sem custo."
        actionLabel="Explorar biblioteca"
        actionHref={routes.biblioteca}
        className="mb-14"
      />

      {resources.length === 0 ? (
        <HomeEmptyNote message="Explore artigos no blog ou visite a biblioteca de materiais gratuitos." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {resources.map((resource) => (
            <Card
              key={resource.id}
              variant="default"
              hover
              padding="lg"
              className="flex h-full flex-col bg-off-white"
            >
              <div className="flex gap-5">
                <ContentCover
                  src={resource.coverImageUrl}
                  alt={resource.title}
                  className="h-20 w-20 shrink-0"
                >
                  <IconBox name={resource.icon} size={22} className="h-full w-full rounded-xl" />
                </ContentCover>
                <CardHeader className="mb-0 min-w-0 flex-1">
                  <p className="font-heading text-xs font-semibold uppercase tracking-wider text-sage">
                    {resource.format} · {resource.pages} páginas
                  </p>
                  <CardTitle className="mt-1 text-lg">{resource.title}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-2 text-sm">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
              </div>
              <Button
                href={routes.bibliotecaItem(resource.slug)}
                variant="outline"
                size="sm"
                className="mt-6 w-full justify-center sm:w-auto"
              >
                Baixar material
              </Button>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
