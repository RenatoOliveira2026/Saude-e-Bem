"use client";

import { CategoryFilter } from "@/components/pages/CategoryFilter";
import { ToolsExploreSection } from "@/components/pages/ToolsExploreSection";
import { FeaturedToolBanner } from "@/components/pages/ToolCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { sortToolsForDisplay, toolCategories } from "@/lib/data/tools";
import type { Tool } from "@/lib/data/types";
import { useMemo, useState } from "react";

interface ToolsListingProps {
  tools: Tool[];
  featured: Tool;
}

export function ToolsListing({ tools, featured }: ToolsListingProps) {
  const [active, setActive] = useState("todos");

  const sortedTools = useMemo(() => sortToolsForDisplay(tools), [tools]);

  /** Inclui todas as ferramentas publicadas — inclusive a featured no grid inferior */
  const catalogTools = useMemo(() => {
    if (active === "todos") return sortedTools;
    return sortedTools.filter((t) => t.category === active);
  }, [active, sortedTools]);

  const sectionTitle =
    active === "todos"
      ? "Todas as ferramentas"
      : active === "calculadora"
        ? "Calculadoras"
        : "Avaliações";

  return (
    <>
      <Section background="default" spacing="compact" container={false}>
        <Container>
          <FeaturedToolBanner tool={featured} />
        </Container>
      </Section>
      <Section background="white" container={false} spacing="compact">
        <Container className="space-y-4">
          <CategoryFilter
            categories={toolCategories}
            active={active}
            onChange={setActive}
          />
          <p className="text-sm text-muted">
            {catalogTools.length} ferramenta{catalogTools.length !== 1 ? "s" : ""}{" "}
            disponíve{catalogTools.length !== 1 ? "is" : "l"}
            {active === "calculadora" && " · Calculadoras"}
            {active === "avaliacao" && " · Avaliações"}
          </p>
        </Container>
      </Section>
      <ToolsExploreSection
        tools={catalogTools}
        title={sectionTitle}
        description={
          active === "todos"
            ? "Seis ferramentas interativas gratuitas — calculadoras e avaliações para sua jornada de saúde."
            : undefined
        }
      />
    </>
  );
}
