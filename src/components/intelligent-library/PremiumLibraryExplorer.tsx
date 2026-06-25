"use client";

import { CategoryFilter } from "@/components/pages/CategoryFilter";
import {
  FeaturedIntelligentLibraryBanner,
  IntelligentLibraryCard,
} from "@/components/intelligent-library/IntelligentLibraryCard";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { LIBRARY_FILTERS } from "@/lib/intelligent-library/library-filters";
import type { LibraryFilterId } from "@/lib/intelligent-library/library.types";
import {
  filterEnrichedLibrary,
  getLibraryNovidades,
  LIBRARY_DIFFICULTY_FILTERS,
  LIBRARY_DURATION_FILTERS,
  LIBRARY_OBJECTIVE_FILTERS,
  type EnrichedLibraryItem,
  type LibraryDifficultyFilterId,
  type LibraryDurationFilterId,
  type LibraryObjectiveFilterId,
} from "@/lib/premium/library-enrichment";
import { useMemo, useState } from "react";

interface PremiumLibraryExplorerProps {
  items: EnrichedLibraryItem[];
  featured: EnrichedLibraryItem | null;
}

export function PremiumLibraryExplorer({ items, featured }: PremiumLibraryExplorerProps) {
  const [typeFilter, setTypeFilter] = useState<LibraryFilterId>("todos");
  const [objective, setObjective] = useState<LibraryObjectiveFilterId>("todos");
  const [difficulty, setDifficulty] = useState<LibraryDifficultyFilterId>("todos");
  const [duration, setDuration] = useState<LibraryDurationFilterId>("todos");

  const novidades = useMemo(() => getLibraryNovidades(items, 6), [items]);

  const filtered = useMemo(
    () =>
      filterEnrichedLibrary(items, {
        typeFilter,
        objective,
        difficulty,
        duration,
      }),
    [items, typeFilter, objective, difficulty, duration],
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

      {novidades.length > 0 && (
        <Section background="sage" spacing="compact">
          <Container>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <Badge variant="gold" className="mb-2">
                  Novidades
                </Badge>
                <h2 className="font-heading text-2xl text-forest">
                  Lançamentos e materiais premium recentes
                </h2>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {novidades.map((item) => (
                <IntelligentLibraryCard key={`new-${item.id}`} item={item} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section background="white">
        <Container>
          <p className="font-heading text-xs font-semibold uppercase tracking-widest text-sage">
            Filtrar catálogo
          </p>
          <h2 className="mt-2 font-heading text-xl text-forest">Encontre por objetivo e nível</h2>

          <div className="mt-6 space-y-4">
            <CategoryFilter
              categories={LIBRARY_FILTERS}
              active={typeFilter}
              onChange={(id) => setTypeFilter(id as LibraryFilterId)}
              ariaLabel="Tipo de material"
            />
            <CategoryFilter
              categories={LIBRARY_OBJECTIVE_FILTERS}
              active={objective}
              onChange={(id) => setObjective(id as LibraryObjectiveFilterId)}
              ariaLabel="Objetivo"
            />
            <CategoryFilter
              categories={LIBRARY_DIFFICULTY_FILTERS}
              active={difficulty}
              onChange={(id) => setDifficulty(id as LibraryDifficultyFilterId)}
              ariaLabel="Dificuldade"
            />
            <CategoryFilter
              categories={LIBRARY_DURATION_FILTERS}
              active={duration}
              onChange={(id) => setDuration(id as LibraryDurationFilterId)}
              ariaLabel="Tempo estimado"
            />
          </div>

          <p className="mt-6 text-sm text-muted">
            {filtered.length} material{filtered.length !== 1 ? "is" : ""} encontrado
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </Container>

        {filtered.length === 0 ? (
          <Container>
            <p className="py-12 text-center text-muted">
              Nenhum material com esses filtros. Tente ampliar a busca.
            </p>
          </Container>
        ) : (
          <div className="mx-auto mt-10 grid max-w-[var(--container-max)] gap-6 px-[var(--container-px)] sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div key={item.id} className="relative">
                <IntelligentLibraryCard item={item} />
                <div className="mt-2 flex flex-wrap gap-1 px-1">
                  <Badge variant="outline" className="text-xs">
                    {item.intelligence.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ~{item.intelligence.estimatedMinutes} min
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
