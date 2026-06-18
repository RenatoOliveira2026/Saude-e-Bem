import { BillingProfileStatus } from "@/components/billing/BillingProfileStatus";
import { LeadCaptureSection } from "@/components/leads";
import { PageHero } from "@/components/layout/PageHero";
import { SubscribeCheckoutForm } from "@/components/payments";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getCurrentUser, getUserProfile } from "@/lib/auth/session";
import { isBillingProfileComplete } from "@/lib/billing/profile";
import { isMercadoPagoConfigured, isRealCheckoutEnabled } from "@/lib/payments/config";
import {
  formatPlanPriceLabel,
  PREMIUM_ANNUAL_PLAN,
  PREMIUM_MONTHLY_PLAN,
  PREMIUM_QUARTERLY_PLAN,
} from "@/lib/payments/plans";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Assinar Premium — Clube Saúde & Bem",
  description:
    "Assine o Clube Saúde & Bem Premium via Mercado Pago — PIX, cartão ou boleto.",
};

interface PageProps {
  searchParams: Promise<{ plano?: string }>;
}

export default async function AssinarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const configured = isMercadoPagoConfigured();
  const realCheckout = isRealCheckoutEnabled();

  const returnPath = params.plano
    ? `${routes.assinar}?plano=${encodeURIComponent(params.plano)}`
    : routes.assinar;

  const user = await getCurrentUser();
  let billingComplete = false;
  if (user) {
    const userProfile = await getUserProfile(user.id);
    billingComplete = isBillingProfileComplete(userProfile.profile);
  }

  return (
    <>
      <PageHero
        badge="Premium"
        title="Assinar Clube Saúde & Bem"
        description={`Gratuito, ${formatPlanPriceLabel(PREMIUM_MONTHLY_PLAN)}, ${formatPlanPriceLabel(PREMIUM_QUARTERLY_PLAN)} ou ${formatPlanPriceLabel(PREMIUM_ANNUAL_PLAN)}. PIX, cartão ou boleto via Mercado Pago.`}
      />
      <Section background="white" spacing="compact">
        <Container size="sm" className="min-w-0">
          <BillingProfileStatus
            isLoggedIn={Boolean(user)}
            billingComplete={billingComplete}
            returnPath={returnPath}
          />
          {realCheckout ? (
            <p className="mb-6 rounded-lg border border-sage/40 bg-sage-muted/30 px-4 py-3 text-sm text-forest">
              Pagamento seguro via Mercado Pago. Plano mensal no cartão renova
              automaticamente.
            </p>
          ) : !configured ? (
            <p className="mb-6 rounded-lg border border-gold/30 bg-gold-muted/20 px-4 py-3 text-sm text-forest">
              Modo de testes: configure o Mercado Pago para pagamento real.
            </p>
          ) : null}
          <Suspense fallback={null}>
            <SubscribeCheckoutForm
              billingComplete={billingComplete}
              isLoggedIn={Boolean(user)}
              returnPath={returnPath}
            />
          </Suspense>
        </Container>
      </Section>
      <LeadCaptureSection source="assinar" />
    </>
  );
}
