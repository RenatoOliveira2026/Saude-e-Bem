import { ToolsGrid } from "@/components/pages/ToolsGrid";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { Tool } from "@/lib/data/types";
import { routes } from "@/lib/routes";

interface ToolsExploreSectionProps {
  tools: Tool[];
  title?: string;
  description?: string;
  showAllLink?: boolean;
}

export function ToolsExploreSection({
  tools,
  title = "Todas as ferramentas",
  description = "Seis ferramentas interativas gratuitas para apoiar sua jornada de saúde.",
  showAllLink = false,
}: ToolsExploreSectionProps) {
  if (tools.length === 0) return null;

  return (
    <Section background="sage" spacing="compact" container={false}>
      <Container>
        <h2 className="font-heading text-xl text-forest md:text-2xl">{title}</h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted text-pretty">{description}</p>
        )}
        <p className="mt-3 text-sm text-muted">
          {tools.length} ferramenta{tools.length !== 1 ? "s" : ""} disponíve
          {tools.length !== 1 ? "is" : "l"}
        </p>
      </Container>
      <ToolsGrid tools={tools} className="mx-auto mt-8 grid max-w-[var(--container-max)] gap-6 px-[var(--container-px)] sm:grid-cols-2 lg:grid-cols-3" />
      {showAllLink && (
        <Container className="mt-8 text-center">
          <Button href={routes.ferramentas} variant="outline" size="md">
            Ver página de ferramentas
          </Button>
        </Container>
      )}
    </Section>
  );
}
