import { CrossLinks, PageCta } from "@/components/pages";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DetailHero, RelatedNav } from "@/components/layout/DetailPage";
import { JsonLdScript } from "@/components/seo/JsonLd";
import { PremiumGate } from "@/components/subscription/PremiumGate";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/icons";
import type { LibraryItem } from "@/lib/intelligent-library";
import { getLibraryItemHref } from "@/lib/intelligent-library/library-links";
import { resolveLibraryAssetUrl } from "@/lib/intelligent-library";
import { routes } from "@/lib/routes";
import { bookJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";

const typeLabels: Record<LibraryItem["type"], string> = {
  ebook: "E-book",
  pdf: "PDF",
  protocolo: "Protocolo",
  video: "Vídeo",
  affiliate: "Afiliado",
};

interface IntelligentLibraryDetailProps {
  item: LibraryItem;
  related: LibraryItem[];
  canAccessPremium: boolean;
}

export function IntelligentLibraryDetail({
  item,
  related,
  canAccessPremium,
}: IntelligentLibraryDetailProps) {
  const assetUrl = resolveLibraryAssetUrl(item);
  const isLocked = item.isPremium && !canAccessPremium;
  const summary = item.longDescription ?? item.description;
  const path = routes.bibliotecaItem(item.slug);
  const protocolHref =
    item.type === "protocolo" ? getLibraryItemHref(item) : undefined;

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Início", path: routes.home },
            { name: "Biblioteca", path: routes.biblioteca },
            { name: item.title },
          ]),
          bookJsonLd({
            title: item.title,
            description: item.seoDescription ?? summary,
            path,
            imageUrl: item.ogImageUrl ?? item.image ?? undefined,
            isPremium: item.isPremium,
          }),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Início", href: routes.home },
          { label: "Biblioteca", href: routes.biblioteca },
          { label: item.title },
        ]}
      />

      <DetailHero
        badge={item.category}
        title={item.title}
        description={summary}
        premium={item.isPremium}
        meta={[
          {
            icon: "book",
            label: `${typeLabels[item.type]} · ${item.estimatedReadTime}`,
          },
          {
            icon: item.isPremium ? "lock" : "download",
            label: item.isPremium ? "🔒 Exclusivo para assinantes" : "Acesso gratuito",
          },
        ]}
        cta={
          isLocked
            ? {
                label: item.type === "protocolo" ? "Ver protocolo" : "Assinar agora",
                href: item.type === "protocolo" ? (protocolHref ?? routes.assinar) : routes.assinar,
                variant: "gold",
              }
            : item.type === "protocolo"
              ? {
                  label: "Ver protocolo completo",
                  href: protocolHref ?? routes.protocolos,
                  variant: "primary",
                }
              : item.isPremium
                ? undefined
                : {
                    label: "Acessar conteúdo",
                    href: assetUrl ?? "#conteudo",
                    variant: "primary",
                  }
        }
      />

      {isLocked ? (
        <PremiumGate
          title="Conteúdo exclusivo para assinantes"
          description="Assine o Clube Saúde & Bem para desbloquear este material e toda a biblioteca premium."
          ctaLabel="Assinar agora"
        />
      ) : (
        <Section background="white" id="conteudo">
          <Container size="md">
            <div className="flex flex-wrap gap-2">
              <PlanBadge tier={item.isPremium ? "premium" : "free"} />
              <Badge variant="default">{typeLabels[item.type]}</Badge>
            </div>

            <h2 className="mt-8 font-heading text-2xl text-forest">Sobre este material</h2>
            <p className="mt-4 text-muted leading-relaxed text-pretty">{summary}</p>

            {item.type === "protocolo" && (
              <div className="mt-8 rounded-2xl border border-sage/30 bg-sage-muted/30 p-6">
                <p className="font-heading text-lg text-forest">Protocolo estruturado</p>
                <p className="mt-2 text-sm text-muted text-pretty">
                  Este material é um protocolo premium com passo a passo diário, checklist e
                  benefícios. Acesse a página completa para iniciar sua jornada.
                </p>
              </div>
            )}

            {!item.isPremium && item.type !== "protocolo" && (
              <div className="mt-8 rounded-2xl border border-sage/30 bg-sage-muted/30 p-6">
                <p className="font-heading text-lg text-forest">Conteúdo gratuito</p>
                <p className="mt-2 text-sm text-muted text-pretty">
                  {assetUrl
                    ? "O download estará disponível em breve via Supabase Storage."
                    : "Material preparado para entrega via Supabase Storage (PDF, vídeo ou e-book)."}
                </p>
                {item.assets?.storagePath && (
                  <p className="mt-3 font-mono text-xs text-muted-light">
                    Storage: {item.assets.storagePath}
                  </p>
                )}
              </div>
            )}

            {item.isPremium && canAccessPremium && (
              <div className="mt-8 rounded-2xl border border-gold/30 bg-gold-muted/30 p-6">
                <div className="flex items-start gap-3">
                  <Icon name="star" size={20} className="mt-0.5 shrink-0 text-gold" />
                  <div>
                    <p className="font-heading text-lg text-forest">Acesso premium liberado</p>
                    <p className="mt-2 text-sm text-muted text-pretty">
                      Conteúdo disponível para sua assinatura ativa.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Container>
        </Section>
      )}

      {related.length > 0 && (
        <RelatedNav
          title="Materiais relacionados"
          links={related.map((r) => ({
            label: r.title,
            href: getLibraryItemHref(r),
            description: `${typeLabels[r.type]} · ${r.estimatedReadTime}`,
          }))}
        />
      )}

      <PageCta
        title="Explore mais conteúdos"
        description="Filtre por gratuitos, premium, e-books, protocolos e vídeos na biblioteca inteligente."
        primaryLabel="Voltar à biblioteca"
        primaryHref={routes.biblioteca}
        secondaryLabel="Ver protocolos"
        secondaryHref={routes.protocolos}
        background="gold"
      />
      <CrossLinks />
    </>
  );
}
