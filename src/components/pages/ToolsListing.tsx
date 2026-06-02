"use client";

import { CategoryFilter } from "@/components/pages/CategoryFilter";
import { FeaturedToolBanner, ToolCard } from "@/components/pages/ToolCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { toolCategories } from "@/lib/data/tools";
import type { Tool } from "@/lib/data/types";
import { useMemo, useState } from "react";

interface ToolsListingProps {
  tools: Tool[];
  featured: Tool;
}

export function ToolsListing({ tools, featured }: ToolsListingProps) {
  const [active, setActive] = useState("todos");

  const filtered = useMemo(
    () =>
      active === "todos"
        ? tools
        : tools.filter((t) => t.category === active),
    [active, tools],
  );

  return (
    <>
      <Section background="default" spacing="compact">
        <Container>
          <FeaturedToolBanner tool={featured} />
        </Container>
      </Section>
      <Section background="white">
        <Container>
          <CategoryFilter
            categories={toolCategories}
            active={active}
            onChange={setActive}
          />
          <p className="mt-4 text-sm text-muted">
            {filtered.length} ferramenta{filtered.length !== 1 ? "s" : ""}{" "}
            disponíve{filtered.length !== 1 ? "is" : "l"}
          </p>
        </Container>
        <div className="mx-auto mt-10 grid max-w-[var(--container-max)] gap-6 px-[var(--container-px)] sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </Section>
    </>
  );
}
