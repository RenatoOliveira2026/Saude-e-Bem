import { BillingProfileStatus } from "@/components/billing/BillingProfileStatus";
import { PageHero } from "@/components/layout/PageHero";
import { SubscribeCheckoutForm } from "@/components/payments";
import { SubscribeTrustPanel } from "@/components/payments/SubscribeTrustPanel";
import { AssinarFaqSection } from "@/components/payments/AssinarFaqSection";
import { JsonLdScript } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getCurrentUser, getUserProfile } from "@/lib/auth/session";
import { isBillingProfileComplete } from "@/lib/billing/profile";
import {
  ASSINAR_PAGE_DESCRIPTION,
  ASSINAR_PAGE_TITLE,
  assinarCheckoutFaqs,
} from "@/lib/conversion/assinar-content";
import { isMercadoPagoConfigured, isRealCheckoutEnabled } from "@/lib/payments/config";
import {
  formatPlanPriceLabel,
  PREMIUM_ANNUAL_PLAN,
  PREMIUM_MONTHLY_PLAN,
} from "@/lib/payments/plans";
import { routes } from "@/lib/routes";
import { faqJsonLd, productJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";
import { buildContentMetadata } from "@/lib/seo/metadata";
import { Suspense } from "react";

export const metadata = buildContentMetadata({
  title: ASSINAR_PAGE_TITLE,
  description: ASSINAR_PAGE_DESCRIPTION,
  path: routes.assinar,
  keywords: "assinatura, premium, clube, mercado pago, pix, saúde, bem-estar",
});

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

  const heroDescription = `Plano mensal ${formatPlanPriceLabel(PREMIUM_MONTHLY_PLAN)} ou anual ${formatPlanPriceLabel(PREMIUM_ANNUAL_PLAN)}. PIX, cartão ou boleto via Mercado Pago — acesso imediato ao Premium após confirmação.`;

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            title: ASSINAR_PAGE_TITLE,
            description: ASSINAR_PAGE_DESCRIPTION,
            path: routes.assinar,
          }),
          productJsonLd({
            title: "Clube Saúde & Bem Premium",
            description: ASSINAR_PAGE_DESCRIPTION,
            path: routes.assinar,
            price: PREMIUM_MONTHLY_PLAN.amountCents / 100,
          }),
          faqJsonLd([...assinarCheckoutFaqs]),
        ]}
      />
      <PageHero
        badge="Premium"
        title="Assinar Clube Saúde & Bem"
        description={heroDescription}
      />
      <Section background="white" spacing="compact">
        <Container size="sm" className="min-w-0">
          <SubscribeTrustPanel />
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
      <AssinarFaqSection />
    </>
  );
}
