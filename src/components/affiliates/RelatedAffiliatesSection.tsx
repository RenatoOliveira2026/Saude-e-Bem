import { AffiliateCardGrid } from "@/components/affiliates/AffiliateCardGrid";
import { AffiliateDisclosure } from "@/components/affiliates/AffiliateDisclosure";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { AffiliateSourceType } from "@/lib/affiliates/tracking";
import type { PublicAffiliateSummary } from "@/lib/affiliates/types";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface RelatedAffiliatesSectionProps {
  links: PublicAffiliateSummary[];
  title?: string;
  description?: string;
  sourcePage: string;
  sourceType: Extract<AffiliateSourceType, "blog" | "protocol" | "related">;
}

export function RelatedAffiliatesSection({
  links,
  title = "Recursos que podem apoiar este tema",
  description = "Seleção editorial alinhada ao conteúdo que você está lendo.",
  sourcePage,
  sourceType,
}: RelatedAffiliatesSectionProps) {
  if (links.length === 0) return null;

  return (
    <Section background="default" spacing="default">
      <Container size="md">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Recomendações
          </p>
          <h2 className="mt-3 font-heading text-2xl text-forest md:text-3xl">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
        </div>

        <div className="mt-10">
          <AffiliateCardGrid
            links={links}
            compact
            sourcePage={sourcePage}
            sourceType={sourceType}
          />
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <AffiliateDisclosure />
          <Link
            href={routes.recomendados}
            className="text-sm font-semibold text-forest underline-offset-4 hover:text-sage hover:underline"
          >
            Ver todos os recursos recomendados
          </Link>
        </div>
      </Container>
    </Section>
  );
}
