import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ContentCover } from "@/components/content/ContentCover";
import { IconBox } from "@/components/icons";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/Section";
import type { LibraryResource } from "@/lib/data/types";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface FreeLibrarySectionProps {
  resources: LibraryResource[];
}

export function FreeLibrarySection({ resources }: FreeLibrarySectionProps) {
  if (resources.length === 0) return null;

  return (
    <Section background="gold" id="biblioteca">
      <SectionHeader>
        <SectionLabel>Biblioteca</SectionLabel>
        <SectionTitle>Biblioteca Gratuita</SectionTitle>
        <SectionDescription>
          Guias, checklists e materiais curados pela nossa equipe — download
          gratuito para começar sua transformação hoje.
        </SectionDescription>
      </SectionHeader>

      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <Link
            key={resource.id}
            href={routes.bibliotecaItem(resource.slug)}
            className="group block"
          >
            <Card
              variant="default"
              hover
              padding="md"
              className="h-full bg-surface/90"
            >
              <div className="flex gap-5">
                <ContentCover
                  src={resource.coverImageUrl}
                  alt={resource.title}
                  className="h-14 w-14 shrink-0 rounded-xl"
                  aspect="card"
                >
                  <IconBox name={resource.icon} size={20} className="h-full w-full rounded-xl" />
                </ContentCover>
                <CardHeader className="mb-0 min-w-0">
                  <p className="font-heading text-xs font-semibold uppercase tracking-wider text-sage">
                    {resource.format} · {resource.pages} páginas
                  </p>
                  <CardTitle className="mt-1 text-lg group-hover:text-sage transition-colors">
                    {resource.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button href={routes.biblioteca} variant="primary">
          Explorar biblioteca completa
        </Button>
      </div>
    </Section>
  );
}
