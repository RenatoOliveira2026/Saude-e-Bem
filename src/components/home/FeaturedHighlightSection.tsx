import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ContentCover } from "@/components/content/ContentCover";
import { blogCategoryIcons, categoryIcons, IconBox } from "@/components/icons";
import { Section } from "@/components/ui/Section";
import { HomeEmptyNote } from "@/components/home/HomeEmptyNote";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import type { BlogArticle, LibraryResource, Protocol } from "@/lib/data/types";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface FeaturedHighlightSectionProps {
  articles: BlogArticle[];
  protocols: Protocol[];
  ebooks: LibraryResource[];
}

export function FeaturedHighlightSection({
  articles,
  protocols,
  ebooks,
}: FeaturedHighlightSectionProps) {
  const hasAny = articles.length > 0 || protocols.length > 0 || ebooks.length > 0;
  if (!hasAny) return null;

  return (
    <Section background="default" id="destaques" spacing="spacious">
      <HomeSectionHeader
        label="Curadoria"
        title="Conteúdos em destaque"
        description="Seleção editorial atualizada pela equipe Saúde & Bem — o que está em evidência agora."
        actionLabel="Ver blog"
        actionHref={routes.blog}
        className="mb-14"
      />

      <div className="space-y-14">
        {articles.length > 0 && (
          <div>
            <h3 className="mb-6 font-heading text-sm font-semibold uppercase tracking-wider text-sage">
              Artigos
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.id} href={routes.artigo(article.slug)} className="group block">
                  <Card variant="default" hover padding="lg" className="flex h-full flex-col bg-surface">
                    <ContentCover src={article.coverImageUrl} alt={article.title} className="mb-4">
                      <IconBox name={blogCategoryIcons[article.category]} size={28} className="bg-surface shadow-soft" />
                    </ContentCover>
                    <Badge variant="gold" className="mb-2 w-fit text-[10px]">
                      Destaque
                    </Badge>
                    <CardHeader className="mb-0 flex-1">
                      <CardTitle className="text-lg leading-snug group-hover:text-sage transition-colors">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-3 text-sm">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {protocols.length > 0 && (
          <div>
            <h3 className="mb-6 font-heading text-sm font-semibold uppercase tracking-wider text-sage">
              Protocolos
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {protocols.map((protocol) => (
                <Link key={protocol.id} href={routes.protocolo(protocol.slug)} className="group block">
                  <Card variant="default" hover padding="lg" className="h-full bg-surface">
                    <ContentCover src={protocol.coverImageUrl} alt={protocol.title} aspect="video" className="mb-4">
                      <IconBox name={categoryIcons[protocol.category]} size={26} className="bg-surface shadow-soft" />
                    </ContentCover>
                    <Badge variant="gold" className="mb-2 w-fit text-[10px]">
                      Destaque
                    </Badge>
                    <CardTitle className="text-lg group-hover:text-sage transition-colors">
                      {protocol.title}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2 text-sm">
                      {protocol.description}
                    </CardDescription>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {ebooks.length > 0 && (
          <div>
            <h3 className="mb-6 font-heading text-sm font-semibold uppercase tracking-wider text-sage">
              Biblioteca
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {ebooks.map((resource) => (
                <Link
                  key={resource.id}
                  href={routes.bibliotecaItem(resource.slug)}
                  className="group block"
                >
                  <Card variant="default" hover padding="lg" className="h-full bg-surface">
                    <ContentCover src={resource.coverImageUrl} alt={resource.title} className="mb-4 h-36">
                      <IconBox name={resource.icon} size={24} className="bg-surface shadow-soft" />
                    </ContentCover>
                    <Badge variant="gold" className="mb-2 w-fit text-[10px]">
                      Destaque
                    </Badge>
                    <CardTitle className="text-lg group-hover:text-sage transition-colors">
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2 text-sm">
                      {resource.description}
                    </CardDescription>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

export function FeaturedHighlightEmpty() {
  return (
    <Section background="default" id="destaques" spacing="compact">
      <HomeEmptyNote message="Em breve, novos conteúdos em destaque. Explore protocolos e a biblioteca gratuita." />
    </Section>
  );
}
