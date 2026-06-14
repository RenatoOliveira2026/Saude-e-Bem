import { GlobalNewsletterSection } from "@/components/newsletter/NewsletterCaptureSection";
import { BlogListing, ContentEmptyState, CrossLinks, PageCta } from "@/components/pages";
import { PageHero } from "@/components/layout/PageHero";
import {
  getBlogArticles,
  getFeaturedBlogArticle,
} from "@/lib/data/repositories/blog.repository";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata = buildContentMetadata({
  title: "Blog",
  description:
    "Artigos aprofundados sobre longevidade, sono, nutrição, imunidade e bem-estar — conteúdo baseado em evidências.",
  path: routes.blog,
});

export default async function BlogPage() {
  const [articles, featured] = await Promise.all([
    getBlogArticles(),
    getFeaturedBlogArticle(),
  ]);

  const isEmpty = articles.length === 0;

  return (
    <>
      <PageHero
        badge="Blog"
        title="Artigos & insights de saúde"
        description="Conteúdo escrito por especialistas para informar, inspirar e traduzir ciência em ações práticas — sem alarmismo, com profundidade."
      />
      {isEmpty ? (
        <ContentEmptyState
          icon="book"
          title="Em breve, novos artigos"
          description="Estamos preparando conteúdo baseado em evidências. Volte em breve ou explore protocolos e ferramentas gratuitas."
          actionLabel="Ver protocolos"
          actionHref={routes.protocolos}
        />
      ) : (
        <BlogListing articles={articles} featured={featured} />
      )}
      <GlobalNewsletterSection source="blog" />
      <PageCta
        title="Coloque em prática"
        description="Transforme conhecimento em ação com protocolos estruturados e ferramentas gratuitas."
        primaryLabel="Ver protocolos"
        primaryHref={routes.protocolos}
        secondaryLabel="Explorar ferramentas"
        secondaryHref={routes.ferramentas}
        background="gold"
      />
      <CrossLinks />
    </>
  );
}
