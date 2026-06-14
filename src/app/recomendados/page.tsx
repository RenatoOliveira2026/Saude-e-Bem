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
        badge="Curadoria"
        title="Recursos recomendados"
        description="Uma seleção discreta de parceiros e ferramentas que podem apoiar seus hábitos — sem pressão, com transparência."
      />

      <Section background="white">
        <Container>
          <RecomendadosListing links={links} />
        </Container>
      </Section>
    </>
  );
}
