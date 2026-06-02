"use client";

import { ArticleCard, FeaturedArticleBanner } from "@/components/pages/ArticleCard";
import { CategoryFilter } from "@/components/pages/CategoryFilter";
import { ContentSearch } from "@/components/pages/ContentSearch";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { blogCategories } from "@/lib/data/blog";
import type { BlogArticle } from "@/lib/data/types";
import { useMemo, useState } from "react";

interface BlogListingProps {
  articles: BlogArticle[];
  featured: BlogArticle | null;
}

function matchesQuery(article: BlogArticle, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    article.title,
    article.excerpt,
    article.categoryLabel,
    article.author,
    ...article.content,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function BlogListing({ articles, featured }: BlogListingProps) {
  const [active, setActive] = useState("todos");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return articles
      .filter((a) => !a.featured)
      .filter((a) => active === "todos" || a.category === active)
      .filter((a) => matchesQuery(a, query));
  }, [active, articles, query]);

  return (
    <>
      {featured && (
        <Section background="default" spacing="compact">
          <Container>
            <FeaturedArticleBanner article={featured} />
          </Container>
        </Section>
      )}
      <Section background="white">
        <Container className="space-y-6">
          <ContentSearch value={query} onChange={setQuery} />
          <CategoryFilter
            categories={blogCategories}
            active={active}
            onChange={setActive}
          />
          <p className="text-sm text-muted">
            {filtered.length} artigo{filtered.length !== 1 ? "s" : ""}
            {query.trim() ? ` para “${query.trim()}”` : ""}
          </p>
        </Container>
        {filtered.length === 0 ? (
          <Container>
            <p className="py-12 text-center text-muted">
              {query.trim()
                ? "Nenhum artigo encontrado para esta busca."
                : "Nenhum artigo nesta categoria ainda."}
            </p>
          </Container>
        ) : (
          <div className="mx-auto mt-10 grid max-w-[var(--container-max)] gap-6 px-[var(--container-px)] sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
