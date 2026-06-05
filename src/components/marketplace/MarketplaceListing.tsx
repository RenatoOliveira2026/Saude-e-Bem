"use client";

import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { CategoryFilter } from "@/components/pages/CategoryFilter";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  filterMarketplaceItems,
  getMarketplaceFilterLabel,
  MARKETPLACE_FILTERS,
} from "@/lib/marketplace/marketplace-filters";
import type {
  MarketplaceFilterId,
  MarketplaceItem,
} from "@/lib/marketplace/marketplace.types";
import { routes } from "@/lib/routes";
import { useMemo, useState } from "react";

interface MarketplaceListingProps {
  items: MarketplaceItem[];
}

export function MarketplaceListing({ items }: MarketplaceListingProps) {
  const [active, setActive] = useState<MarketplaceFilterId>("todos");

  const filtered = useMemo(
    () => filterMarketplaceItems(items, active),
    [active, items],
  );

  return (
    <Section background="white" container={false} spacing="compact">
      <Container className="space-y-4">
        <CategoryFilter
          categories={MARKETPLACE_FILTERS}
          active={active}
          onChange={(id) => setActive(id as MarketplaceFilterId)}
          ariaLabel="Filtrar marketplace"
        />
        <p className="text-sm text-muted">
          {filtered.length} produto{filtered.length !== 1 ? "s" : ""}{" "}
          {active === "todos" ? "no catálogo" : `em ${getMarketplaceFilterLabel(active)}`}
        </p>
      </Container>

      {filtered.length === 0 ? (
        <Container>
          <p className="py-12 text-center text-muted">
            Nenhum produto neste filtro ainda.
          </p>
        </Container>
      ) : (
        <div className="mx-auto mt-8 grid max-w-[var(--container-max)] gap-6 px-[var(--container-px)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <MarketplaceCard
              key={item.id}
              item={item}
              sourcePage={routes.marketplace}
              sourceType="marketplace"
            />
          ))}
        </div>
      )}
    </Section>
  );
}
