"use client";

import { CategoryFilter } from "@/components/pages/CategoryFilter";
import {
  FeaturedLibraryBanner,
  LibraryCard,
} from "@/components/pages/LibraryCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { libraryCategories } from "@/lib/data/library";
import type { LibraryResource } from "@/lib/data/types";
import { useMemo, useState } from "react";

interface LibraryListingProps {
  resources: LibraryResource[];
  featured: LibraryResource | null;
}

export function LibraryListing({ resources, featured }: LibraryListingProps) {
  const [active, setActive] = useState("todos");

  const filtered = useMemo(
    () =>
      active === "todos"
        ? resources
        : resources.filter((r) => r.category === active),
    [active, resources],
  );

  return (
    <>
      {featured && (
        <Section background="gold" spacing="compact">
          <Container>
            <FeaturedLibraryBanner resource={featured} />
          </Container>
        </Section>
      )}
      <Section background="white">
        <Container>
          <CategoryFilter
            categories={libraryCategories}
            active={active}
            onChange={setActive}
          />
          <p className="mt-4 text-sm text-muted">
            {filtered.length} recurso{filtered.length !== 1 ? "s" : ""}{" "}
            encontrado{filtered.length !== 1 ? "s" : ""}
          </p>
        </Container>
        {filtered.length === 0 ? (
          <Container>
            <p className="py-12 text-center text-muted">
              Nenhum material nesta categoria ainda.
            </p>
          </Container>
        ) : (
          <div className="mx-auto mt-10 grid max-w-[var(--container-max)] gap-6 px-[var(--container-px)] sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource) => (
              <LibraryCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
