import { PageHero } from "@/components/layout/PageHero";
import { SubscribeCheckoutForm } from "@/components/payments";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { isMercadoPagoConfigured } from "@/lib/payments/config";
import {
  formatPlanPriceLabel,
  PREMIUM_ANNUAL_PLAN,
  PREMIUM_MONTHLY_PLAN,
} from "@/lib/payments/plans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assinar Premium — Clube Saúde & Bem",
  description:
    "Assine o Clube Saúde & Bem Premium via Mercado Pago — PIX, cartão ou boleto.",
};

export default function AssinarPage() {
  const configured = isMercadoPagoConfigured();

  return (
    <>
      <PageHero
        badge="Premium"
        title="Assinar Clube Saúde & Bem"
        description={`Premium ${formatPlanPriceLabel(PREMIUM_MONTHLY_PLAN)} ou ${formatPlanPriceLabel(PREMIUM_ANNUAL_PLAN)}. Escolha PIX, cartão ou boleto.`}
      />
      <Section background="white">
        <Container size="sm">
          {!configured && (
            <p className="mb-6 rounded-lg border border-gold/30 bg-gold-muted/20 px-4 py-3 text-sm text-forest">
              Modo stub: configure{" "}
              <code className="text-xs">MERCADOPAGO_ACCESS_TOKEN</code> e{" "}
              <code className="text-xs">NEXT_PUBLIC_SITE_URL</code> para checkout
              real. Enquanto isso, o fluxo local permite simular aprovação.
            </p>
          )}
          <SubscribeCheckoutForm />
        </Container>
      </Section>
    </>
  );
}
