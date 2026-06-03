import { LogoAuth } from "@/components/brand/Logo";
import { OfflineReloadButton } from "@/components/pwa/OfflineReloadButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sem conexão",
  description: "Você está offline. Reconecte-se para continuar navegando.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <Section className="py-16 md:py-24">
      <Container size="sm" className="text-center">
        <div className="mx-auto mb-8 flex justify-center">
          <LogoAuth />
        </div>
        <h1 className="font-heading text-2xl font-semibold text-forest md:text-3xl">
          Você está offline
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Não foi possível carregar esta página. Verifique sua conexão com a
          internet e tente novamente. Conteúdos já visitados podem estar
          disponíveis quando o app estiver instalado.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href={routes.home}>Ir para o início</Button>
          <Button variant="outline" href={routes.protocolos}>
            Ver protocolos
          </Button>
        </div>
        <p className="mt-6">
          <OfflineReloadButton />
        </p>
      </Container>
    </Section>
  );
}
