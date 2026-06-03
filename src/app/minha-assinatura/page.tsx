import { PageHero } from "@/components/layout/PageHero";
import {
  StubCheckoutPanel,
  SubscriptionDashboard,
} from "@/components/payments";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getSubscriptionBillingData } from "@/lib/payments";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha assinatura — Clube Saúde & Bem",
  description:
    "Plano, status, próxima renovação e histórico de pagamentos do Clube Premium.",
};

interface PageProps {
  searchParams: Promise<{
    checkout?: string;
    reference?: string;
    status?: string;
  }>;
}

export default async function MinhaAssinaturaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getSubscriptionBillingData();
  const isStubCheckout =
    params.checkout === "stub" && Boolean(params.reference);

  return (
    <>
      <PageHero
        badge="Conta"
        title="Minha assinatura"
        description="Gerencie seu plano premium e acompanhe seus pagamentos."
      />
      <Section background="white">
        <Container size="md">
          {isStubCheckout && params.reference && (
            <div className="mb-8">
              <StubCheckoutPanel externalReference={params.reference} />
            </div>
          )}
          {params.status === "success" && (
            <p className="mb-6 rounded-lg bg-sage-muted/40 px-4 py-3 text-sm text-forest">
              Pagamento recebido. Sua assinatura será atualizada em instantes.
            </p>
          )}
          {params.status === "pending" && (
            <p className="mb-6 rounded-lg bg-gold-muted/30 px-4 py-3 text-sm text-forest">
              Pagamento pendente — aguardando confirmação (PIX ou boleto).
            </p>
          )}
          {params.status === "failure" && (
            <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              Pagamento não concluído. Tente novamente em Assinar Premium.
            </p>
          )}
          <SubscriptionDashboard data={data} />
        </Container>
      </Section>
    </>
  );
}
