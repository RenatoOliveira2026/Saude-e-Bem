"use client";

import { CategoryFilter } from "@/components/pages/CategoryFilter";
import {
  FeaturedProtocolBanner,
  ProtocolCard,
} from "@/components/pages/ProtocolCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { protocolCategories } from "@/lib/data/protocols";
import type { Protocol } from "@/lib/data/types";
import { useMemo, useState } from "react";

interface ProtocolsListingProps {
  protocols: Protocol[];
  featured: Protocol | null;
}

export function ProtocolsListing({ protocols, featured }: ProtocolsListingProps) {
  const [active, setActive] = useState("todos");

  const filtered = useMemo(
    () =>
      active === "todos"
        ? protocols
        : protocols.filter((p) => p.category === active),
    [active, protocols],
  );

  return (
    <>
      {featured && (
        <Section background="default" spacing="compact">
          <Container>
            <FeaturedProtocolBanner protocol={featured} />
          </Container>
        </Section>
      )}
      <Section background="white">
        <Container>
          <CategoryFilter
            categories={protocolCategories}
            active={active}
            onChange={setActive}
            ariaLabel="Filtrar por objetivo"
          />
          <p className="mt-4 text-sm text-muted">
            {filtered.length} protocolo{filtered.length !== 1 ? "s" : ""}{" "}
            encontrado{filtered.length !== 1 ? "s" : ""}
          </p>
        </Container>
        {filtered.length === 0 ? (
          <Container>
            <p className="py-12 text-center text-muted">
              Nenhum protocolo para este objetivo ainda.
            </p>
          </Container>
        ) : (
          <div className="mx-auto mt-10 grid max-w-[var(--container-max)] gap-6 px-[var(--container-px)] sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((protocol) => (
              <ProtocolCard key={protocol.id} protocol={protocol} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
