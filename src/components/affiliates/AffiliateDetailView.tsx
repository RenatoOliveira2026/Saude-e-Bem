import { AffiliateDisclosure } from "@/components/affiliates/AffiliateDisclosure";
import { AffiliateTrackLink } from "@/components/affiliates/AffiliateTrackLink";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/icons";
import { AFFILIATE_CATEGORY_OPTIONS } from "@/lib/affiliates/categories";
import { AFFILIATE_OFFER_CTA_LABEL } from "@/lib/affiliates/constants";
import { formatBrl, youtubeEmbedId } from "@/lib/affiliates/tracking";
import type { PublicAffiliateProduct } from "@/lib/affiliates/types";
import Image from "next/image";

function categoryDisplay(category: string): string {
  const match = AFFILIATE_CATEGORY_OPTIONS.find((opt) => opt.value === category);
  return match?.label ?? category;
}

interface AffiliateDetailViewProps {
  product: PublicAffiliateProduct;
}

export function AffiliateDetailView({ product }: AffiliateDetailViewProps) {
  const videoId = youtubeEmbedId(product.videoUrl);
  const currentPrice = formatBrl(product.currentPrice);
  const oldPrice = formatBrl(product.oldPrice);
  const sourcePage = `/recomendados/${product.slug}`;

  return (
    <>
      <Section background="white">
        <Container size="md">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              {videoId ? (
                <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-forest/5">
                  <iframe
                    title={`Vídeo: ${product.title}`}
                    src={`https://www.youtube.com/embed/${videoId}`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : product.imageUrl ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                  <Image
                    src={product.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-sage-muted/40 text-sage">
                  <Icon name="star" size={48} aria-hidden />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">{categoryDisplay(product.category)}</Badge>
                {product.editorChoice && <Badge variant="gold">Escolha do editor</Badge>}
              </div>
              <h1 className="mt-4 font-heading text-3xl text-forest md:text-4xl">
                {product.title}
              </h1>
              {(product.brand || product.producerName) && (
                <p className="mt-2 text-muted">
                  {[product.brand, product.producerName].filter(Boolean).join(" · ")}
                </p>
              )}

              {product.rating != null && (
                <p className="mt-4 flex items-center gap-2 text-sm text-forest">
                  <Icon name="star" size={18} className="text-gold" aria-hidden />
                  <span className="font-semibold">{product.rating.toFixed(1)}</span>
                  {product.reviewsCount > 0 && (
                    <span className="text-muted">
                      ({product.reviewsCount.toLocaleString("pt-BR")} avaliações)
                    </span>
                  )}
                </p>
              )}

              {(currentPrice || product.installments) && (
                <div className="mt-6 rounded-2xl border border-border bg-off-white/60 p-5">
                  {currentPrice && (
                    <p className="font-heading text-2xl text-forest">{currentPrice}</p>
                  )}
                  {oldPrice && (
                    <p className="mt-1 text-sm text-muted line-through">{oldPrice}</p>
                  )}
                  {product.installments && (
                    <p className="mt-2 text-sm text-muted">{product.installments}</p>
                  )}
                </div>
              )}

              <div className="mt-6">
                <AffiliateTrackLink
                  slug={product.slug}
                  label={AFFILIATE_OFFER_CTA_LABEL}
                  sourcePage={sourcePage}
                  sourceType="detail"
                  className="!h-12 !w-full max-w-sm text-base"
                />
              </div>
              <div className="mt-4">
                <AffiliateDisclosure className="!text-left" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {product.description && (
        <Section background="default">
          <Container size="md">
            <h2 className="font-heading text-2xl text-forest">Sobre o produto</h2>
            <p className="mt-4 whitespace-pre-line text-muted leading-relaxed">
              {product.description}
            </p>
          </Container>
        </Section>
      )}

      {product.benefits.length > 0 && (
        <Section background="white">
          <Container size="md">
            <h2 className="font-heading text-2xl text-forest">Benefícios</h2>
            <ul className="mt-6 space-y-3">
              {product.benefits.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-graphite"
                >
                  <Icon name="vitality" size={18} className="mt-0.5 shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {product.targetAudience && (
        <Section background="default">
          <Container size="md">
            <h2 className="font-heading text-2xl text-forest">Para quem é</h2>
            <p className="mt-4 whitespace-pre-line text-muted leading-relaxed">
              {product.targetAudience}
            </p>
          </Container>
        </Section>
      )}

      {product.contraindications && (
        <Section background="white">
          <Container size="md">
            <h2 className="font-heading text-2xl text-forest">Contraindicações</h2>
            <p className="mt-4 whitespace-pre-line text-muted leading-relaxed">
              {product.contraindications}
            </p>
          </Container>
        </Section>
      )}

      {product.testimonials.length > 0 && (
        <Section background="gold">
          <Container size="md">
            <h2 className="font-heading text-2xl text-forest">Depoimentos</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {product.testimonials.map((quote) => (
                <blockquote
                  key={quote}
                  className="rounded-2xl border border-border/60 bg-surface/90 p-5 text-sm leading-relaxed text-graphite"
                >
                  <span className="text-gold" aria-hidden>
                    “
                  </span>
                  {quote}
                  <span className="text-gold" aria-hidden>
                    ”
                  </span>
                </blockquote>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section background="forest">
        <Container size="md" className="text-center">
          <h2 className="font-heading text-2xl text-off-white">Pronto para conhecer?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-off-white/75">
            Acesse a oferta oficial do parceiro. O redirecionamento é seguro e transparente.
          </p>
          <AffiliateTrackLink
            slug={product.slug}
            label={AFFILIATE_OFFER_CTA_LABEL}
            sourcePage={sourcePage}
            sourceType="detail"
            className="mx-auto mt-6 !h-12 !w-full max-w-xs !border-off-white/30 !text-off-white hover:!bg-off-white/10"
          />
        </Container>
      </Section>
    </>
  );
}
