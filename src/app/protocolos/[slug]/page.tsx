import { ContentBlockRenderer } from "@/components/content/ContentBlockRenderer";
import { RelatedAffiliatesSection } from "@/components/affiliates";
import { ContentMemberActions } from "@/components/club/ContentMemberActions";
import { PremiumContentGuard } from "@/components/club/PremiumContentGuard";
import { RelatedContentSection } from "@/components/club/RelatedContentSection";
import { recordContentViewForUser } from "@/lib/club/record-content-view";
import { SmartConversionCta } from "@/components/conversion/SmartConversionCta";
import { CrossLinks } from "@/components/pages";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DetailHero, RelatedNav } from "@/components/layout/DetailPage";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/icons";
import {
  getProtocolBySlug,
  getProtocolSlugs,
  getProtocols,
} from "@/lib/data/repositories/protocols.repository";
import { trackEvent } from "@/lib/analytics/track-event";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";
import { assertValidPublicSlug } from "@/lib/seo/slug";
import { breadcrumbJsonLd, howToJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo/JsonLd";
import { fetchAffiliatesForContentCategory } from "@/lib/supabase/services/affiliates.public";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getProtocolSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  assertValidPublicSlug(slug);
  const protocol = await getProtocolBySlug(slug);
  if (!protocol) notFound();
  return buildContentMetadata({
    title: protocol.seoTitle ?? protocol.title,
    description: protocol.seoDescription ?? protocol.description,
    path: routes.protocolo(slug),
    imageUrl: protocol.ogImageUrl ?? protocol.coverImageUrl,
  });
}

export default async function ProtocoloDetailPage({ params }: PageProps) {
  const { slug } = await params;
  assertValidPublicSlug(slug);
  const protocol = await getProtocolBySlug(slug);
  if (!protocol) notFound();

  void trackEvent({
    eventType: "protocol_view",
    sourcePage: routes.protocolo(slug),
    sourceType: "content",
    contentId: protocol.id ?? slug,
    contentTitle: protocol.title,
    metadata: { slug, category: protocol.category },
  });

  void recordContentViewForUser({
    contentType: "protocol",
    contentId: protocol.id,
    contentTitle: protocol.title,
    contentSlug: slug,
    sourcePath: routes.protocolo(slug),
  });

  const [all, relatedAffiliates] = await Promise.all([
    getProtocols(),
    fetchAffiliatesForContentCategory(
      protocol.category,
      protocol.categoryLabel,
      "protocol",
      3,
    ),
  ]);
  const related = all
    .filter((p) => p.slug !== slug && p.category === protocol.category)
    .slice(0, 3);
  const richBlocks =
    protocol.contentBlocks?.filter(
      (b) => b.type !== "paragraph" || b.text.trim().length > 0,
    ) ?? [];
  const hasRichContent = richBlocks.length > 0;

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Início", path: routes.home },
            { name: "Protocolos", path: routes.protocolos },
            { name: protocol.title },
          ]),
          howToJsonLd({
            title: protocol.title,
            description: protocol.seoDescription ?? protocol.description,
            path: routes.protocolo(slug),
            steps: protocol.steps.map((step) => ({
              title: step.title,
              description: step.description,
            })),
          }),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Início", href: routes.home },
          { label: "Protocolos", href: routes.protocolos },
          { label: protocol.title },
        ]}
      />
      <DetailHero
        badge={protocol.categoryLabel}
        title={protocol.title}
        description={
          protocol.isPremium ? protocol.description : protocol.longDescription
        }
        premium={protocol.isPremium}
        meta={
          protocol.isPremium
            ? undefined
            : [
                { icon: "clock", label: protocol.duration },
                { icon: "activity", label: protocol.level },
                {
                  icon: "users",
                  label: `${protocol.participants.toLocaleString("pt-BR")} participantes`,
                },
              ]
        }
        cta={
          protocol.isPremium
            ? undefined
            : { label: "Iniciar protocolo", href: routes.protocolo(slug) }
        }
      />

      <Section background="sage" spacing="compact">
        <Container size="md">
          <ContentMemberActions
            contentType="protocol"
            contentId={protocol.id}
            showSaveProtocol
          />
        </Container>
      </Section>

      <PremiumContentGuard
        isPremiumContent={protocol.isPremium}
        gateTitle="Protocolo exclusivo do Clube"
        gateDescription="Este protocolo faz parte do conteúdo premium do Clube Saúde & Bem. Assine o Premium para acesso completo."
        preview={
          <Section background="white">
            <Container size="md">
              <h2 className="font-heading text-2xl text-forest">Objetivo</h2>
              <p className="mt-4 text-muted leading-relaxed">{protocol.objective}</p>
            </Container>
          </Section>
        }
      >
      <Section background="white">
        <Container size="md">
          <h2 className="font-heading text-2xl text-forest">Objetivo</h2>
          <p className="mt-4 text-muted leading-relaxed">{protocol.objective}</p>
        </Container>
      </Section>

      <Section background="default">
        <Container size="md">
          <h2 className="font-heading text-2xl text-forest">Benefícios</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {protocol.benefits.map((b) => (
              <li
                key={b}
                className="flex items-center gap-3 rounded-xl bg-sage-muted/50 px-4 py-3 text-sm text-graphite"
              >
                <Icon name="vitality" size={18} className="shrink-0 text-gold" />
                {b}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section background="white">
        <Container size="md">
          <h2 className="font-heading text-2xl text-forest">Etapas do protocolo</h2>
          <div className="mt-8 space-y-4">
            {protocol.steps.map((step, i) => (
              <div
                key={step.title}
                className="flex gap-5 rounded-xl border border-border bg-surface p-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest font-heading text-sm font-bold text-off-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-heading font-semibold text-forest">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {hasRichContent && (
        <Section background="default">
          <Container size="md">
            <h2 className="font-heading text-2xl text-forest">Guia completo</h2>
            <div className="prose-content mt-8">
              <ContentBlockRenderer blocks={richBlocks} />
            </div>
          </Container>
        </Section>
      )}

      <Section background="default">
        <Container size="md">
          <RelatedContentSection
            contentType="protocol"
            contentId={protocol.id}
          />
        </Container>
      </Section>

      {related.length > 0 && (
        <RelatedNav
          title="Protocolos relacionados"
          links={related.map((p) => ({
            label: p.title,
            href: routes.protocolo(p.slug),
            description: p.duration,
          }))}
        />
      )}

      <RelatedAffiliatesSection
        links={relatedAffiliates}
        description={`Recursos que podem complementar seu foco em ${protocol.categoryLabel.toLowerCase()}.`}
        sourcePage={routes.protocolo(slug)}
        sourceType="protocol"
      />

      <SmartConversionCta
        context="protocol"
        category={protocol.category}
        categoryLabel={protocol.categoryLabel}
        contentTitle={protocol.title}
        contentSlug={slug}
      />
      </PremiumContentGuard>
      <CrossLinks />
    </>
  );
}
