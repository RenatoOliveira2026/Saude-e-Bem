"use client";

import { CategoryFilter } from "@/components/pages/CategoryFilter";
import { ContentSearch } from "@/components/pages/ContentSearch";
import {
  FeaturedProtocolBanner,
} from "@/components/pages/ProtocolCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { protocolLibraryFilterCategories } from "@/lib/protocol-library/constants";
import type { ProtocolLibraryItem } from "@/lib/protocol-library/types";
import { useMemo, useState } from "react";
import { ProtocolLibraryCard } from "./ProtocolLibraryCard";

type TierFilter = "all" | "free" | "premium";

const tierOptions: { id: TierFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "free", label: "Gratuitos" },
  { id: "premium", label: "Premium" },
];

interface ProtocolLibraryListingProps {
  protocols: ProtocolLibraryItem[];
  featured: ProtocolLibraryItem | null;
  favoriteIds?: string[];
  isLoggedIn?: boolean;
}

export function ProtocolLibraryListing({
  protocols,
  featured,
  favoriteIds = [],
  isLoggedIn = false,
}: ProtocolLibraryListingProps) {
  const [active, setActive] = useState("todos");
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<TierFilter>("all");

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return protocols.filter((item) => {
      const cat = item.normalizedCategory;
      if (active !== "todos" && cat !== active && item.category !== active) {
        return false;
      }
      if (tier === "free" && item.isPremium) return false;
      if (tier === "premium" && !item.isPremium) return false;
      if (!q) return true;
      const haystack = [
        item.title,
        item.description,
        item.objective,
        item.categoryLabel,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [active, protocols, query, tier]);

  const freeCount = protocols.filter((p) => !p.isPremium).length;

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
        <Container className="space-y-6">
          <div className="rounded-xl border border-sage/30 bg-sage-muted/40 px-4 py-3 text-sm text-muted">
            <strong className="text-forest">{freeCount}</strong> protocolo
            {freeCount !== 1 ? "s" : ""} com acesso liberado · Premium exige
            assinatura ativa do Clube
          </div>
          <ContentSearch
            value={query}
            onChange={setQuery}
            placeholder="Buscar por título, objetivo ou categoria…"
          />
          <CategoryFilter
            categories={protocolLibraryFilterCategories}
            active={active}
            onChange={setActive}
            ariaLabel="Filtrar por categoria"
          />
          <div className="flex flex-wrap gap-2">
            {tierOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTier(opt.id)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  tier === opt.id
                    ? "border-forest bg-forest text-off-white"
                    : "border-border bg-surface text-muted hover:border-sage"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted">
            {filtered.length} protocolo{filtered.length !== 1 ? "s" : ""}
            {query.trim() ? ` para “${query.trim()}”` : ""}
          </p>
        </Container>
        {filtered.length === 0 ? (
          <Container>
            <p className="py-12 text-center text-muted">
              {query.trim()
                ? "Nenhum protocolo encontrado para esta busca."
                : "Nenhum protocolo nesta categoria ainda."}
            </p>
          </Container>
        ) : (
          <div className="mx-auto mt-10 grid max-w-[var(--container-max)] gap-6 px-[var(--container-px)] sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((protocol) => (
              <ProtocolLibraryCard
                key={protocol.id}
                protocol={protocol}
                showFavorite={isLoggedIn}
                favorited={favoriteSet.has(protocol.id)}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
