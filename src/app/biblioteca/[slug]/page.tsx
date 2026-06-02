import { CrossLinks, LibraryDownloadPanel, PageCta } from "@/components/pages";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import {
  DetailHero,
  PremiumGate,
  RelatedNav,
} from "@/components/layout/DetailPage";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/icons";
import {
  getLibraryResourceBySlug,
  getLibrarySlugs,
  getLibraryResources,
} from "@/lib/data/repositories/library.repository";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getLibrarySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
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
  const resource = await getLibraryResourceBySlug(slug);
  if (!resource) notFound();

  const all = await getLibraryResources();
  const related = all
    .filter((r) => r.slug !== slug && r.category === resource.category)
    .slice(0, 3);

  if (resource.isPremium) {
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
          description={resource.description}
          premium
        />
        <PremiumGate
          title="Recurso premium"
          description="Este material faz parte da biblioteca ampliada do Clube Saúde & Bem."
        />
        <CrossLinks />
      </>
    );
  }

  const downloadHref = resource.pdfUrl ?? "#download";

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
        description={resource.longDescription}
        meta={[
          { icon: "book", label: `${resource.format} · ${resource.pages} páginas` },
          {
            icon: "download",
            label: `${resource.downloads.toLocaleString("pt-BR")} downloads`,
          },
        ]}
        cta={{
          label: resource.pdfUrl ? "Baixar PDF" : "Solicitar material",
          href: downloadHref,
          variant: "primary",
        }}
      />

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
      <CrossLinks />
    </>
  );
}
