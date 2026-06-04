import { ProtocolLibraryDashboard } from "@/components/protocol-library";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { requireUser } from "@/lib/auth/session";
import { getProtocolLibraryDashboard } from "@/lib/protocol-library";
import { fetchUserFavorites } from "@/lib/supabase/services/favorites.service";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel de Protocolos — Saúde & Bem",
  description:
    "Recomendações IA, favoritos, histórico e novidades da biblioteca inteligente de protocolos.",
  robots: { index: false, follow: false },
};

export default async function ProtocolosPainelPage() {
  const user = await requireUser();
  const [data, favoritesRaw] = await Promise.all([
    getProtocolLibraryDashboard(),
    fetchUserFavorites(user.id),
  ]);

  const favoriteIds = favoritesRaw
    .filter((f) => f.contentType === "protocol")
    .map((f) => f.contentId);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", href: routes.home },
          { label: "Protocolos", href: routes.protocolos },
          { label: "Painel inteligente" },
        ]}
      />
      <Section background="default">
        <Container size="lg">
          <ProtocolLibraryDashboard
            data={data}
            userId={user.id}
            favoriteIds={favoriteIds}
          />
        </Container>
      </Section>
    </>
  );
}
