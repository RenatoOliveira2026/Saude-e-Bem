import {
  ContentEmptyState,
  CrossLinks,
  PageCta,
} from "@/components/pages";
import { GlobalNewsletterSection } from "@/components/newsletter/NewsletterCaptureSection";
import { ProtocolLibraryListing } from "@/components/protocol-library";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getCurrentUser } from "@/lib/auth/session";
import { getProtocolLibraryItems } from "@/lib/protocol-library/services/library.service";
import { fetchUserFavorites } from "@/lib/supabase/services/favorites.service";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata = buildContentMetadata({
  title: "Biblioteca de Protocolos",
  description:
    "Rotinas estruturadas por categoria — sono, alimentação, estresse, saúde mental e mais. Gratuitos e Premium com recomendações IA.",
  path: routes.protocolos,
});

export default async function ProtocolosPage() {
  const [protocols, user] = await Promise.all([
    getProtocolLibraryItems(),
    getCurrentUser(),
  ]);

  const featured =
    protocols.find((p) => p.featured) ?? protocols[0] ?? null;

  const favoriteIds =
    user &&
    (await fetchUserFavorites(user.id))
      .filter((f) => f.contentType === "protocol")
      .map((f) => f.contentId);

  const isEmpty = protocols.length === 0;

  return (
    <>
      <PageHero
        badge="Biblioteca Inteligente"
        title="Protocolos para sua jornada"
        description="Filtre por categoria, busque por palavra-chave e acesse protocolos gratuitos ou Premium com recomendações personalizadas."
      />
      {user && (
        <Section background="sage" spacing="compact">
          <Container className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted">
              Acesse seu painel com recomendações IA, favoritos e histórico.
            </p>
            <Button href={routes.protocolosPainel} size="sm">
              Meu painel de protocolos
            </Button>
          </Container>
        </Section>
      )}
      {isEmpty ? (
        <ContentEmptyState
          icon="sparkle"
          title="Protocolos em preparação"
          description="Novos protocolos estruturados estarão disponíveis em breve. Enquanto isso, explore ferramentas gratuitas e artigos do blog."
          actionLabel="Explorar ferramentas"
          actionHref={routes.ferramentas}
        />
      ) : (
        <ProtocolLibraryListing
          protocols={protocols}
          featured={featured}
          favoriteIds={favoriteIds ?? []}
          isLoggedIn={Boolean(user)}
        />
      )}
      <GlobalNewsletterSection source="protocolos" />
      <PageCta
        title="Protocolos premium no Clube Saúde & Bem"
        description="Desbloqueie rotinas avançadas, acompanhamento e comunidade exclusiva para acelerar sua jornada."
        primaryLabel="Conhecer o Clube"
        primaryHref={routes.clube}
        secondaryLabel={user ? "Meu painel" : "Entrar"}
        secondaryHref={user ? routes.protocolosPainel : routes.entrar}
      />
      <CrossLinks />
    </>
  );
}
