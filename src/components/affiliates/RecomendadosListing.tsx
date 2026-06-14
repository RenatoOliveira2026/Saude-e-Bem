"use client";

import { AffiliateCardGrid } from "@/components/affiliates/AffiliateCardGrid";
import { AffiliateDisclosure } from "@/components/affiliates/AffiliateDisclosure";
import { ContentSearch } from "@/components/pages/ContentSearch";
import {
  AFFILIATE_CATEGORY_OPTIONS,
  resolveAffiliateCategory,
} from "@/lib/affiliates/categories";
import { AFFILIATE_PRODUCT_TYPES } from "@/lib/affiliates/types";
import type { PublicAffiliateSummary } from "@/lib/affiliates/types";
import { useMemo, useState } from "react";

interface RecomendadosListingProps {
  links: PublicAffiliateSummary[];
}

function matchesFilters(
  link: PublicAffiliateSummary,
  query: string,
  category: string,
  productType: string,
): boolean {
  if (category !== "todos" && resolveAffiliateCategory(link.category) !== category) {
    return false;
  }
  if (productType !== "todos" && link.productType !== productType) return false;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [link.title, link.brand, link.description, link.category]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function RecomendadosListing({ links }: RecomendadosListingProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todos");
  const [productType, setProductType] = useState("todos");

  const filtered = useMemo(
    () => links.filter((link) => matchesFilters(link, query, category, productType)),
    [links, query, category, productType],
  );

  if (links.length === 0) {
    return (
      <p className="py-16 text-center text-muted">
        Nenhum recurso disponível no momento. Volte em breve.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <ContentSearch
          value={query}
          onChange={setQuery}
          placeholder="Buscar por nome do produto ou marca…"
          className="flex-1"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-full border border-border bg-surface px-4 text-sm text-forest"
            aria-label="Filtrar por categoria"
          >
            <option value="todos">Todas as categorias</option>
            {AFFILIATE_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="h-10 rounded-full border border-border bg-surface px-4 text-sm text-forest"
            aria-label="Filtrar por tipo"
          >
            <option value="todos">Todos os tipos</option>
            {AFFILIATE_PRODUCT_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-muted">
        {filtered.length} de {links.length} recurso{links.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted">
          Nenhum resultado para os filtros selecionados.
        </p>
      ) : (
        <AffiliateCardGrid
          links={filtered}
          sourcePage="/recomendados"
          sourceType="listing"
        />
      )}

      <div className="border-t border-border pt-8">
        <AffiliateDisclosure />
      </div>
    </div>
  );
}
