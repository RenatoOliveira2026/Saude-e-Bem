import { CompleteBillingProfileForm } from "@/components/billing/CompleteBillingProfileForm";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { resolveBillingReturnPath } from "@/lib/billing/guards";
import { isBillingProfileComplete } from "@/lib/billing/profile";
import { getSessionProfile } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Complete seus dados",
  description:
    "Informe CPF, celular e endereço para continuar com o pagamento no Clube Saúde & Bem.",
};

interface PageProps {
  searchParams: Promise<{ next?: string; redirect?: string }>;
}

export default async function CompletarCadastroPage({ searchParams }: PageProps) {
  const { user, profile } = await getSessionProfile();
  const params = await searchParams;
  const returnPath = resolveBillingReturnPath(
    params.next,
    params.redirect,
    routes.minhaAssinatura,
  );

  if (isBillingProfileComplete(profile.profile)) {
    redirect(returnPath);
  }

  return (
    <>
      <PageHero
        badge="Pagamento"
        title="Complete seus dados para continuar"
        description="Precisamos dessas informações para processar seu pagamento com segurança."
      />
      <Section background="white" spacing="compact">
        <Container size="sm">
          <CompleteBillingProfileForm
            profile={profile.profile}
            email={user.email ?? profile.profile?.email ?? ""}
            returnPath={returnPath}
          />
        </Container>
      </Section>
    </>
  );
}
