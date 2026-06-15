import { RecomendadosMarketplace } from "@/components/affiliates/RecomendadosMarketplace";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getRecomendadosMarketplaceData } from "@/lib/affiliates/marketplace";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata = buildContentMetadata({
  title: "Recursos recomendados — Saúde & Bem",
  description:
    "Marketplace de ofertas reais em saúde e bem-estar — destaques, mais acessados, novidades e categorias curadas.",
  path: routes.recomendados,
});

export default async function RecomendadosPage() {
  const data = await getRecomendadosMarketplaceData();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", href: routes.home },
          { label: "Recursos recomendados" },
        ]}
      />
      <PageHero
        badge="Marketplace de Ofertas"
        title="Recursos recomendados"
        description="Ofertas reais curadas por categoria — suplementos, livros, sono, alimentação e bem-estar. Transparência total: links podem gerar comissão sem custo extra para você."
      />

      <Section background="white">
        <Container>
          <RecomendadosMarketplace data={data} />
        </Container>
      </Section>
    </>
  );
}
