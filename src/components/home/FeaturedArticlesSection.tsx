import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ContentCover } from "@/components/content/ContentCover";
import { blogCategoryIcons, IconBox } from "@/components/icons";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/Section";
import type { BlogArticle } from "@/lib/data/types";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface FeaturedArticlesSectionProps {
  articles: BlogArticle[];
}

export function FeaturedArticlesSection({ articles }: FeaturedArticlesSectionProps) {
  if (articles.length === 0) return null;

  return (
    <Section background="white" id="artigos">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeader align="left" className="mb-0 md:max-w-xl">
          <SectionLabel>Blog</SectionLabel>
          <SectionTitle>Artigos em Destaque</SectionTitle>
          <SectionDescription className="text-left">
            Conteúdo aprofundado sobre saúde, longevidade e bem-estar — escrito
            para informar, não para alarmar.
          </SectionDescription>
        </SectionHeader>
        <Button href={routes.blog} variant="outline" className="shrink-0 self-start">
          Ver todos os artigos
        </Button>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={routes.artigo(article.slug)}
            className="group block"
          >
            <Card variant="default" hover padding="lg" className="flex h-full flex-col">
              <ContentCover
                src={article.coverImageUrl}
                alt={article.title}
                className="mb-5"
              >
                <IconBox
                  name={blogCategoryIcons[article.category]}
                  size={32}
                  className="bg-surface/90 shadow-soft"
                />
              </ContentCover>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">{article.categoryLabel}</Badge>
                <span className="text-xs text-muted-light">{article.readTime}</span>
              </div>
              <CardHeader className="mb-0 mt-4 flex-1">
                <CardTitle className="text-lg leading-snug group-hover:text-sage transition-colors">
                  {article.title}
                </CardTitle>
                <CardDescription className="mt-3 text-sm leading-relaxed">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <p className="mt-4 text-xs text-muted-light">{article.publishedAt}</p>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
