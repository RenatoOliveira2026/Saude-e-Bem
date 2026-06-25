import { PageHero } from "@/components/layout/PageHero";
import { PremiumActivatedTracker } from "@/components/analytics/PremiumActivatedTracker";
import {
  CheckoutReturnSync,
  StubCheckoutPanel,
  SubscriptionDashboard,
} from "@/components/payments";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getSubscriptionBillingData } from "@/lib/payments";
import { isStubModeEnabled } from "@/lib/payments/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha assinatura — Clube Saúde & Bem",
  description:
    "Plano, status, próxima renovação e histórico de pagamentos do Clube Premium.",
  robots: { index: false, follow: false },
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
    isStubModeEnabled() &&
    params.checkout === "stub" &&
    Boolean(params.reference);

  const checkoutReference = params.reference;
  const checkoutStatus =
    params.status === "success" || params.status === "pending"
      ? params.status
      : null;

  return (
    <>
      <PremiumActivatedTracker
        isPremium={data.membership.isPremium}
        planSlug={data.membership.subscription?.billingPlanId ?? data.membership.profilePlan}
        checkoutSuccess={checkoutStatus === "success"}
      />
      <PageHero
        badge="Conta"
        title="Minha assinatura"
        description="Gerencie seu plano premium e acompanhe seus pagamentos."
      />
      <Section background="white">
        <Container size="md">
          {isStubCheckout && checkoutReference && (
            <div className="mb-8">
              <StubCheckoutPanel externalReference={checkoutReference} />
            </div>
          )}
          {checkoutReference && checkoutStatus && !isStubCheckout && (
            <CheckoutReturnSync
              externalReference={checkoutReference}
              status={checkoutStatus}
            />
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
