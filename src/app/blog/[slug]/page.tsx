import { RelatedAffiliatesSection } from "@/components/affiliates";
import { ContentMemberActions } from "@/components/club/ContentMemberActions";
import { PremiumContentGuard } from "@/components/club/PremiumContentGuard";
import { recordContentViewForUser } from "@/lib/club/record-content-view";
import { CrossLinks, PageCta } from "@/components/pages";
import { PublicArticleBody } from "@/components/content/PublicArticleBody";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DetailHero, RelatedNav } from "@/components/layout/DetailPage";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  getBlogArticleBySlug,
  getBlogArticles,
  getBlogSlugs,
} from "@/lib/data/repositories/blog.repository";
import { trackEvent } from "@/lib/analytics/track-event";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";
import { fetchAffiliatesForContentCategory } from "@/lib/supabase/services/affiliates.public";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticleBySlug(slug);
  if (!article) return { title: "Artigo não encontrado" };
  return buildContentMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    path: routes.artigo(slug),
    imageUrl: article.ogImageUrl ?? article.coverImageUrl,
    type: "article",
  });
}

export default async function ArtigoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getBlogArticleBySlug(slug);
  if (!article) notFound();

  void trackEvent({
    eventType: "article_view",
    sourcePage: routes.artigo(slug),
    sourceType: "content",
    contentId: article.id ?? slug,
    contentTitle: article.title,
    metadata: { slug, category: article.category },
  });

  void recordContentViewForUser({
    contentType: "article",
    contentId: article.id,
    contentTitle: article.title,
    contentSlug: slug,
    sourcePath: routes.artigo(slug),
  });

  const [all, relatedAffiliates] = await Promise.all([
    getBlogArticles(),
    fetchAffiliatesForContentCategory(
      article.category,
      article.categoryLabel,
      "blog",
      3,
    ),
  ]);
  const related = all
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 3);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", href: routes.home },
          { label: "Blog", href: routes.blog },
          { label: article.title },
        ]}
      />
      <DetailHero
        badge={article.categoryLabel}
        title={article.title}
        description={article.excerpt}
        premium={article.isPremium}
        meta={[
          { icon: "profile", label: article.author },
          { icon: "clock", label: `${article.readTime} de leitura` },
        ]}
      />

      <Section background="sage" spacing="compact">
        <Container size="md">
          <ContentMemberActions contentType="article" contentId={article.id} />
        </Container>
      </Section>

      <PremiumContentGuard
        isPremiumContent={article.isPremium}
        gateTitle="Artigo exclusivo do Clube"
        gateDescription="Este artigo faz parte do conteúdo premium do Clube Saúde & Bem."
      >
      <Section background="white">
        <Container size="sm">
          <p className="text-sm text-muted">
            {article.author} · {article.authorRole} · {article.publishedAt}
          </p>
          <article className="mt-8">
            <PublicArticleBody
              blocks={article.contentBlocks}
              fallbackParagraphs={article.content}
            />
          </article>
        </Container>
      </Section>

      {related.length > 0 && (
        <RelatedNav
          title="Artigos relacionados"
          links={related.map((a) => ({
            label: a.title,
            href: routes.artigo(a.slug),
            description: a.readTime,
          }))}
        />
      )}

      <RelatedAffiliatesSection
        links={relatedAffiliates}
        description={`Materiais selecionados para quem explora ${article.categoryLabel.toLowerCase()}.`}
        sourcePage={routes.artigo(slug)}
        sourceType="blog"
      />

      <PageCta
        title="Coloque em prática"
        description="Explore protocolos alinhados ao tema deste artigo."
        primaryLabel="Ver protocolos"
        primaryHref={routes.protocolos}
        secondaryLabel="Ferramentas gratuitas"
        secondaryHref={routes.ferramentas}
        background="forest"
      />
      </PremiumContentGuard>
      <CrossLinks />
    </>
  );
}
