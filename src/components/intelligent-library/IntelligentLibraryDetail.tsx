import { CrossLinks, PageCta } from "@/components/pages";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DetailHero, RelatedNav } from "@/components/layout/DetailPage";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/icons";
import type { LibraryItem } from "@/lib/intelligent-library";
import { resolveLibraryAssetUrl } from "@/lib/intelligent-library";
import { routes } from "@/lib/routes";

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
}

export function IntelligentLibraryDetail({
  item,
  related,
}: IntelligentLibraryDetailProps) {
  const assetUrl = resolveLibraryAssetUrl(item);
  const actionHref = item.isPremium ? routes.assinar : assetUrl ?? "#conteudo";
  const actionLabel = item.isPremium ? "Assinar para acessar" : "Acessar conteúdo";

  return (
    <>
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
        description={item.description}
        premium={item.isPremium}
        meta={[
          {
            icon: "book",
            label: `${typeLabels[item.type]} · ${item.estimatedReadTime}`,
          },
          {
            icon: item.isPremium ? "lock" : "download",
            label: item.isPremium ? "Conteúdo exclusivo" : "Acesso gratuito",
          },
        ]}
        cta={
          item.isPremium
            ? {
                label: actionLabel,
                href: actionHref,
                variant: "gold",
              }
            : {
                label: actionLabel,
                href: actionHref,
                variant: "primary",
              }
        }
      />

      <Section background="white" id="conteudo">
        <Container size="md">
          <div className="flex flex-wrap gap-2">
            <Badge variant={item.isPremium ? "gold" : "sage"}>
              {item.isPremium ? "Premium" : "Gratuito"}
            </Badge>
            <Badge variant="default">{typeLabels[item.type]}</Badge>
          </div>

          <h2 className="mt-8 font-heading text-2xl text-forest">Sobre este material</h2>
          <p className="mt-4 text-muted leading-relaxed text-pretty">{item.description}</p>

          {item.isPremium ? (
            <div className="mt-8 rounded-2xl border border-gold/30 bg-gold-muted/40 p-6">
              <div className="flex items-start gap-3">
                <Icon name="lock" size={20} className="mt-0.5 shrink-0 text-gold" />
                <div>
                  <p className="font-heading text-lg text-forest">Conteúdo para assinantes</p>
                  <p className="mt-2 text-sm text-muted text-pretty">
                    Assine o Clube Saúde & Bem para desbloquear este material e toda a
                    biblioteca premium — e-books, protocolos, vídeos e novidades mensais.
                  </p>
                  <Button href={routes.assinar} variant="secondary" size="md" className="mt-4">
                    Assinar para acessar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
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
        </Container>
      </Section>

      {related.length > 0 && (
        <RelatedNav
          title="Materiais relacionados"
          links={related.map((r) => ({
            label: r.title,
            href: routes.bibliotecaItem(r.slug),
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
