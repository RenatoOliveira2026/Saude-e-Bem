import { AffiliateCard } from "@/components/affiliates/AffiliateCard";
import { AffiliateCardGrid } from "@/components/affiliates/AffiliateCardGrid";
import { RecomendadosListing } from "@/components/affiliates/RecomendadosListing";
import { Button } from "@/components/ui/Button";
import type { RecomendadosMarketplaceData } from "@/lib/affiliates/marketplace";
import type { PublicAffiliateSummary } from "@/lib/affiliates/types";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface RecomendadosMarketplaceProps {
  data: RecomendadosMarketplaceData;
}

function MarketplaceSection({
  id,
  title,
  description,
  links,
  horizontalOnMobile = false,
}: {
  id: string;
  title: string;
  description?: string;
  links: PublicAffiliateSummary[];
  horizontalOnMobile?: boolean;
}) {
  if (links.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl text-forest md:text-3xl">{title}</h2>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
          )}
        </div>
      </div>

      {horizontalOnMobile ? (
        <div className="-mx-1 mt-6 flex gap-4 overflow-x-auto px-1 pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="min-w-[78%] shrink-0 snap-start sm:min-w-0 sm:shrink"
            >
              <AffiliateCard
                link={link}
                compact
                sourcePage="/recomendados"
                sourceType="listing"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <AffiliateCardGrid
            links={links}
            compact
            sourcePage="/recomendados"
            sourceType="listing"
          />
        </div>
      )}
    </section>
  );
}

export function RecomendadosMarketplace({ data }: RecomendadosMarketplaceProps) {
  if (data.all.length === 0) {
    return (
      <p className="py-16 text-center text-muted">
        Nenhuma oferta disponível no momento. Volte em breve.
      </p>
    );
  }

  return (
    <div className="space-y-16 md:space-y-20">
      <nav
        aria-label="Atalhos do marketplace"
        className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface p-3 shadow-soft"
      >
        {[
          { href: "#destaques", label: "Destaques" },
          { href: "#mais-acessados", label: "Mais acessados" },
          { href: "#novidades", label: "Novidades" },
          { href: "#categorias", label: "Categorias" },
          { href: "#catalogo", label: "Catálogo completo" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-forest transition-colors hover:bg-sage-muted"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <MarketplaceSection
        id="destaques"
        title="Destaques"
        description="Ofertas selecionadas pela curadoria Saúde & Bem."
        links={data.featured}
        horizontalOnMobile
      />

      <MarketplaceSection
        id="mais-acessados"
        title="Mais acessados"
        description="Produtos com maior volume de cliques nos últimos 30 dias."
        links={data.mostClicked}
        horizontalOnMobile
      />

      <MarketplaceSection
        id="novidades"
        title="Novidades"
        description="Últimas ofertas adicionadas ao marketplace."
        links={data.newest}
      />

      <section id="categorias" className="scroll-mt-24">
        <h2 className="font-heading text-2xl text-forest md:text-3xl">Categorias</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Explore ofertas por tema — suplementos, livros, sono, alimentação e bem-estar.
        </p>
        <div className="mt-8 space-y-10">
          {data.categories.map((section) => (
            <div key={section.slug} id={`categoria-${section.slug}`} className="scroll-mt-24">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-heading text-xl text-forest">{section.label}</h3>
                <Button href={`#catalogo`} variant="outline" size="sm">
                  Ver no catálogo
                </Button>
              </div>
              <AffiliateCardGrid
                links={section.links}
                compact
                sourcePage="/recomendados"
                sourceType="listing"
              />
            </div>
          ))}
        </div>
      </section>

      <section id="catalogo" className="scroll-mt-24 border-t border-border pt-12">
        <div className="mb-8">
          <h2 className="font-heading text-2xl text-forest md:text-3xl">Catálogo completo</h2>
          <p className="mt-2 text-sm text-muted">
            Busque, filtre por categoria e encontre a oferta ideal para sua jornada.
          </p>
        </div>
        <RecomendadosListing links={data.all} />
        <div className="mt-8 text-center">
          <Link
            href={routes.home}
            className="text-sm font-semibold text-forest underline-offset-4 hover:text-sage hover:underline"
          >
            Voltar ao início
          </Link>
        </div>
      </section>
    </div>
  );
}
