"use client";

import { CategoryFilter } from "@/components/pages/CategoryFilter";
import {
  FeaturedIntelligentLibraryBanner,
  IntelligentLibraryCard,
} from "@/components/intelligent-library/IntelligentLibraryCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  filterLibraryItems,
  getFilterLabel,
  LIBRARY_FILTERS,
} from "@/lib/intelligent-library/library-filters";
import type {
  LibraryFilterId,
  LibraryItem,
} from "@/lib/intelligent-library/library.types";
import { useMemo, useState } from "react";

interface IntelligentLibraryListingProps {
  items: LibraryItem[];
  featured: LibraryItem | null;
}

export function IntelligentLibraryListing({
  items,
  featured,
}: IntelligentLibraryListingProps) {
  const [active, setActive] = useState<LibraryFilterId>("todos");

  const filtered = useMemo(
    () => filterLibraryItems(items, active),
    [active, items],
  );

  return (
    <>
      {featured && (
        <Section background="gold" spacing="compact">
          <Container>
            <FeaturedIntelligentLibraryBanner item={featured} />
          </Container>
        </Section>
      )}

      <Section background="white">
        <Container>
          <CategoryFilter
            categories={LIBRARY_FILTERS}
            active={active}
            onChange={(id) => setActive(id as LibraryFilterId)}
            ariaLabel="Filtrar biblioteca"
          />
          <p className="mt-4 text-sm text-muted">
            {filtered.length} material{filtered.length !== 1 ? "is" : ""}{" "}
            {active === "todos" ? "no catálogo" : `em ${getFilterLabel(active)}`}
          </p>
        </Container>

        {filtered.length === 0 ? (
          <Container>
            <p className="py-12 text-center text-muted">
              Nenhum material neste filtro ainda.
            </p>
          </Container>
        ) : (
          <div className="mx-auto mt-10 grid max-w-[var(--container-max)] gap-6 px-[var(--container-px)] sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <IntelligentLibraryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
