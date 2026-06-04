import { ProtocolHistoryList } from "@/components/protocol-library";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { requireUser } from "@/lib/auth/session";
import { fetchUserProtocolHistory } from "@/lib/protocol-library/services/history.service";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protocolos recentes — Saúde & Bem",
  description: "Protocolos que você visualizou recentemente.",
  robots: { index: false, follow: false },
};

export default async function ProtocolosRecentesPage() {
  const user = await requireUser();
  const history = await fetchUserProtocolHistory(user.id, 24);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", href: routes.home },
          { label: "Protocolos", href: routes.protocolos },
          { label: "Recentemente visualizados" },
        ]}
      />
      <Section background="default">
        <Container size="md" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl text-forest">
                Recentemente visualizados
              </h1>
              <p className="mt-2 text-muted">
                Histórico dedicado de protocolos (Fase 4.2). Também disponível
                no painel inteligente.
              </p>
            </div>
            <Button href={routes.protocolosPainel} variant="outline" size="sm">
              Voltar ao painel
            </Button>
          </div>
          <ProtocolHistoryList entries={history} />
        </Container>
      </Section>
    </>
  );
}
