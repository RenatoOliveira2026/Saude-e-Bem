import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ContentCover } from "@/components/content/ContentCover";
import { blogCategoryIcons, Icon, IconBox } from "@/components/icons";
import { resolveArticleCoverUrl } from "@/lib/blog/resolve-article-cover";
import { routes } from "@/lib/routes";
import type { BlogArticle } from "@/lib/data/types";

export function ArticleCard({ article }: { article: BlogArticle }) {
  const coverSrc = resolveArticleCoverUrl(article);

  return (
    <Card variant="default" hover padding="lg" className="flex h-full flex-col">
      <ContentCover src={coverSrc} alt={article.title} className="mb-5 h-36">
        <IconBox
          name={blogCategoryIcons[article.category]}
          size={32}
          className="bg-surface/90 shadow-soft"
        />
      </ContentCover>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="default">{article.categoryLabel}</Badge>
        <span className="inline-flex items-center gap-1 text-xs text-muted-light">
          <Icon name="clock" size={12} />
          {article.readTime}
        </span>
      </div>
      <CardHeader className="mb-0 mt-4 flex-1">
        <CardTitle className="text-lg leading-snug">{article.title}</CardTitle>
        <CardDescription className="mt-3 text-sm leading-relaxed">
          {article.excerpt}
        </CardDescription>
      </CardHeader>
      <p className="text-xs text-muted-light">{article.publishedAt}</p>
      <div className="mt-4 border-t border-border pt-4">
        <Button
          href={routes.artigo(article.slug)}
          variant="ghost"
          size="sm"
          className="w-full justify-center font-semibold text-forest hover:text-sage"
        >
          Ler artigo
        </Button>
      </div>
    </Card>
  );
}

export function FeaturedArticleBanner({ article }: { article: BlogArticle }) {
  const coverSrc = resolveArticleCoverUrl(article);

  return (
    <Card variant="featured" padding="lg" className="overflow-hidden">
      <div className="grid gap-8 lg:grid-cols-2">
        <ContentCover
          src={coverSrc}
          alt={article.title}
          aspect="video"
          className="min-h-[220px] bg-gradient-to-br from-forest/90 to-sage/70"
        >
          <IconBox
            name={blogCategoryIcons[article.category]}
            size={40}
            className="bg-off-white/15 text-off-white"
          />
        </ContentCover>
        <div className="flex flex-col justify-center">
          <Badge variant="gold" className="mb-3 w-fit">
            Artigo em destaque
          </Badge>
          <Badge variant="default" className="mb-3 w-fit">
            {article.categoryLabel}
          </Badge>
          <h2 className="font-heading text-2xl text-forest text-balance md:text-3xl">
            {article.title}
          </h2>
          <p className="mt-4 text-muted leading-relaxed">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button href={routes.artigo(article.slug)} size="md">
              Ler artigo
            </Button>
            <span className="text-sm text-muted">
              {article.readTime} · {article.author}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
