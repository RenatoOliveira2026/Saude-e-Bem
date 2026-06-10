import { CrossLinks, PageCta, ToolsListing } from "@/components/pages";
import { PageHero } from "@/components/layout/PageHero";
import {
  getFeaturedTool,
  getTools,
} from "@/lib/data/repositories/tools.repository";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";

export const metadata = buildContentMetadata({
  title: "Ferramentas",
  description:
    "Avaliações, calculadoras e ferramentas de monitoramento gratuitas para entender e acompanhar sua saúde.",
  path: routes.ferramentas,
});

export default async function FerramentasPage() {
  const [tools, featured] = await Promise.all([
    getTools(),
    getFeaturedTool(),
  ]);

  return (
    <>
      <PageHero
        badge="100% Gratuito"
        title="Ferramentas para sua jornada de saúde"
        description="Avalie seu perfil, calcule métricas importantes e monitore sua evolução — recursos interativos sem custo para começar agora."
      />
      <ToolsListing tools={tools} featured={featured} />
      <PageCta
        title="Quer ferramentas avançadas?"
        description="Membros do Clube Saúde & Bem têm acesso a trackers, dashboards e avaliações premium."
        primaryLabel="Ver Clube Saúde & Bem"
        primaryHref={routes.clube}
        secondaryLabel="Explorar protocolos"
        secondaryHref={routes.protocolos}
        background="sage"
      />
      <CrossLinks />
    </>
  );
}
