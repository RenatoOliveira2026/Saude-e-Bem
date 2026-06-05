import { CrossLinks, LibraryDownloadPanel, PageCta } from "@/components/pages";
import { IntelligentLibraryDetail } from "@/components/intelligent-library";
import { ContentMemberActions } from "@/components/club/ContentMemberActions";
import { PremiumContentGuard } from "@/components/club/PremiumContentGuard";
import { recordContentViewForUser } from "@/lib/club/record-content-view";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DetailHero, RelatedNav } from "@/components/layout/DetailPage";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/icons";
import {
  getLibraryResourceBySlug,
  getLibrarySlugs,
  getLibraryResources,
} from "@/lib/data/repositories/library.repository";
import {
  fetchIntelligentLibraryItemBySlug,
  fetchIntelligentLibraryItems,
  getIntelligentLibrarySlugs,
} from "@/lib/intelligent-library";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const [legacySlugs, intelligentSlugs] = await Promise.all([
    getLibrarySlugs(),
    Promise.resolve(getIntelligentLibrarySlugs()),
  ]);
  const slugs = [...new Set([...legacySlugs, ...intelligentSlugs])];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const intelligent = await fetchIntelligentLibraryItemBySlug(slug);
  if (intelligent) {
    return buildContentMetadata({
      title: intelligent.title,
      description: intelligent.description,
      path: routes.bibliotecaItem(slug),
      imageUrl: intelligent.image,
    });
  }
  const resource = await getLibraryResourceBySlug(slug);
  if (!resource) return { title: "Recurso não encontrado" };
  return buildContentMetadata({
    title: resource.seoTitle ?? resource.title,
    description: resource.seoDescription ?? resource.description,
    path: routes.bibliotecaItem(slug),
    imageUrl: resource.ogImageUrl ?? resource.coverImageUrl,
  });
}

export default async function BibliotecaDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const intelligentItem = await fetchIntelligentLibraryItemBySlug(slug);
  if (intelligentItem) {
    const allIntelligent = await fetchIntelligentLibraryItems();
    const related = allIntelligent
      .filter(
        (r) =>
          r.slug !== slug &&
          (r.category === intelligentItem.category || r.type === intelligentItem.type),
      )
      .slice(0, 3);
    return (
      <IntelligentLibraryDetail item={intelligentItem} related={related} />
    );
  }

  const resource = await getLibraryResourceBySlug(slug);
  if (!resource) notFound();

  const all = await getLibraryResources();
  const related = all
    .filter((r) => r.slug !== slug && r.category === resource.category)
    .slice(0, 3);

  const downloadHref = resource.pdfUrl ?? "#download";

  void recordContentViewForUser({
    contentType: "ebook",
    contentId: resource.id,
    contentTitle: resource.title,
    contentSlug: slug,
    sourcePath: routes.bibliotecaItem(slug),
  });

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", href: routes.home },
          { label: "Biblioteca", href: routes.biblioteca },
          { label: resource.title },
        ]}
      />
      <DetailHero
        badge={resource.categoryLabel}
        title={resource.title}
        description={
          resource.isPremium ? resource.description : resource.longDescription
        }
        premium={resource.isPremium}
        meta={
          resource.isPremium
            ? undefined
            : [
                {
                  icon: "book",
                  label: `${resource.format} · ${resource.pages} páginas`,
                },
                {
                  icon: "download",
                  label: `${resource.downloads.toLocaleString("pt-BR")} downloads`,
                },
              ]
        }
        cta={
          resource.isPremium
            ? undefined
            : {
                label: resource.pdfUrl ? "Baixar PDF" : "Solicitar material",
                href: downloadHref,
                variant: "primary",
              }
        }
      />

      <Section background="sage" spacing="compact">
        <Container size="md">
          <ContentMemberActions contentType="ebook" contentId={resource.id} />
        </Container>
      </Section>

      <PremiumContentGuard
        isPremiumContent={resource.isPremium}
        gateTitle="Recurso premium"
        gateDescription="Este material faz parte da biblioteca ampliada do Clube Saúde & Bem."
      >
      <Section background="white" id="download">
        <Container size="md">
          <h2 className="font-heading text-2xl text-forest">Conteúdo incluído</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {resource.highlights.map((h) => (
              <li
                key={h}
                className="flex items-center gap-3 rounded-xl bg-sage-muted/50 px-4 py-3 text-sm"
              >
                <Icon name="checklist" size={18} className="shrink-0 text-sage" />
                {h}
              </li>
            ))}
          </ul>
          <LibraryDownloadPanel
            pdfUrl={resource.pdfUrl}
            title={resource.title}
            slug={slug}
            contentId={resource.id}
          />
        </Container>
      </Section>

      {related.length > 0 && (
        <RelatedNav
          title="Recursos relacionados"
          links={related.map((r) => ({
            label: r.title,
            href: routes.bibliotecaItem(r.slug),
            description: `${r.pages} páginas`,
          }))}
        />
      )}

      <PageCta
        title="Aplique o conhecimento"
        description="Transforme o que aprendeu em ação com nossos protocolos estruturados."
        primaryLabel="Ver protocolos"
        primaryHref={routes.protocolos}
        secondaryLabel="Ler artigos"
        secondaryHref={routes.blog}
        background="gold"
      />
      </PremiumContentGuard>
      <CrossLinks />
    </>
  );
}
