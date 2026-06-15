import { CrossLinks, PageCta, ToolsExploreSection } from "@/components/pages";
import { PremiumContentGuard } from "@/components/club/PremiumContentGuard";
import { getToolComponent } from "@/components/tools";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import {
  DetailHero,
} from "@/components/layout/DetailPage";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Icon, IconBox } from "@/components/icons";
import {
  getToolBySlug,
  getToolSlugs,
  getTools,
} from "@/lib/data/repositories/tools.repository";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";
import { assertValidPublicSlug } from "@/lib/seo/slug";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getToolSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  assertValidPublicSlug(slug);
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();
  return buildContentMetadata({
    title: tool.title,
    description: tool.description,
    path: routes.ferramenta(slug),
  });
}

export default async function FerramentaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  assertValidPublicSlug(slug);
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  const all = await getTools();
  const otherTools = all.filter((t) => t.slug !== slug);
  const ToolInteractive = getToolComponent(slug);
  if (!ToolInteractive && !tool.isPremium) {
    console.warn(`[ferramentas] Sem componente interativo para slug: ${slug}`);
  }

  if (tool.isPremium) {
    return (
      <>
        <Breadcrumbs
          items={[
            { label: "Início", href: routes.home },
            { label: "Ferramentas", href: routes.ferramentas },
            { label: tool.title },
          ]}
        />
        <DetailHero
          badge={tool.categoryLabel}
          title={tool.title}
          description={tool.description}
          premium
        />
        <PremiumContentGuard
          isPremiumContent
          gateTitle="Ferramenta premium do Clube"
          gateDescription="Disponível exclusivamente para membros premium do Clube Saúde & Bem."
          preview={
            <Section background="default">
              <Container size="md">
                <h2 className="font-heading text-2xl text-forest">O que você recebe</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {tool.features.slice(0, 4).map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm"
                    >
                      <Icon name="star" size={16} className="shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Container>
            </Section>
          }
        >
          <Section background="white" id="inicio">
            <Container size="md">
              {ToolInteractive ? <ToolInteractive /> : null}
            </Container>
          </Section>
        </PremiumContentGuard>
        <CrossLinks />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", href: routes.home },
          { label: "Ferramentas", href: routes.ferramentas },
          { label: tool.title },
        ]}
      />
      <DetailHero
        badge={tool.categoryLabel}
        title={tool.title}
        description={tool.longDescription}
        meta={[
          { icon: "clock", label: tool.duration },
          { icon: tool.icon, label: tool.categoryLabel },
        ]}
        cta={{ label: "Iniciar agora", href: "#inicio", variant: "primary" }}
      />

      <Section background="white" id="inicio">
        <Container size={ToolInteractive ? "md" : "sm"}>
          {ToolInteractive ? (
            <ToolInteractive />
          ) : (
            <div className="rounded-xl border border-dashed border-border-strong bg-sage-muted/40 px-8 py-12 text-center">
              <IconBox name={tool.icon} size={32} className="mx-auto bg-surface" />
              <h2 className="mt-6 font-heading text-xl text-forest">
                Ferramenta interativa em breve
              </h2>
              <p className="mt-3 text-muted text-pretty">
                A versão interativa de {tool.title} será lançada em breve.
                Enquanto isso, explore nossos protocolos e biblioteca.
              </p>
            </div>
          )}
        </Container>
      </Section>

      <Section background="default">
        <Container size="md">
          <h2 className="font-heading text-2xl text-forest">O que você recebe</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {tool.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 rounded-xl bg-surface border border-border px-4 py-3 text-sm"
              >
                <Icon name="star" size={16} className="shrink-0 text-gold" />
                {f}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <ToolsExploreSection
        tools={otherTools}
        title="Outras ferramentas"
        description="Explore toda a biblioteca de ferramentas gratuitas da plataforma."
        showAllLink
      />

      <PageCta
        title="Pronto para ir além?"
        description="Protocolos personalizados baseados no seu perfil de saúde."
        primaryLabel="Ver protocolos"
        primaryHref={routes.protocolos}
        secondaryLabel="Clube Saúde & Bem"
        secondaryHref={routes.clube}
      />
      <CrossLinks />
    </>
  );
}
