import { RecomendadosListing } from "@/components/affiliates/RecomendadosListing";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";
import { fetchAllActiveAffiliateLinks } from "@/lib/supabase/services/affiliates.public";

export const revalidate = 3600;

export const metadata = buildContentMetadata({
  title: "Recursos recomendados — Saúde & Bem",
  description:
    "Seleção editorial de ferramentas e produtos que complementam sua jornada de saúde e bem-estar.",
  path: routes.recomendados,
});

export default async function RecomendadosPage() {
  const links = await fetchAllActiveAffiliateLinks();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", href: routes.home },
          { label: "Recursos recomendados" },
        ]}
      />
      <PageHero
        badge="Central de Recomendações"
        title="Recursos recomendados"
        description="Produtos curados por categoria — suplementos, livros, sono, alimentação e bem-estar. Transparência total: links podem gerar comissão sem custo extra para você."
      />

      <Section background="white">
        <Container>
          <RecomendadosListing links={links} />
        </Container>
      </Section>
    </>
  );
}
