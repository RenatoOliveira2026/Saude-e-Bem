import {
  ContentEmptyState,
  CrossLinks,
  PageCta,
  ProtocolsListing,
} from "@/components/pages";
import { PageHero } from "@/components/layout/PageHero";
import {
  getFeaturedProtocol,
  getProtocols,
} from "@/lib/data/repositories/protocols.repository";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Protocolos",
  description:
    "Rotinas estruturadas baseadas em evidências para sono, energia, longevidade, imunidade e equilíbrio.",
};

export default async function ProtocolosPage() {
  const [protocols, featured] = await Promise.all([
    getProtocols(),
    getFeaturedProtocol(),
  ]);

  const isEmpty = protocols.length === 0;

  return (
    <>
      <PageHero
        badge="Protocolos"
        title="Rotinas que transformam sua saúde"
        description="Planos passo a passo desenvolvidos com base científica — do iniciante ao avançado. Escolha por objetivo, nível e duração."
      />
      {isEmpty ? (
        <ContentEmptyState
          icon="sparkle"
          title="Protocolos em preparação"
          description="Novos protocolos estruturados estarão disponíveis em breve. Enquanto isso, explore ferramentas gratuitas e artigos do blog."
          actionLabel="Explorar ferramentas"
          actionHref={routes.ferramentas}
        />
      ) : (
        <ProtocolsListing protocols={protocols} featured={featured} />
      )}
      <PageCta
        title="Protocolos premium no Clube Saúde & Bem"
        description="Desbloqueie rotinas avançadas, acompanhamento e comunidade exclusiva para acelerar sua jornada."
        primaryLabel="Conhecer o Clube"
        primaryHref={routes.clube}
        secondaryLabel="Ferramentas gratuitas"
        secondaryHref={routes.ferramentas}
      />
      <CrossLinks />
    </>
  );
}
