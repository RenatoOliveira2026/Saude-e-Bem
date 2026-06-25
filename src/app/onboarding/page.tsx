import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { requireUser } from "@/lib/auth/session";
import { getOnboardingData } from "@/lib/onboarding/get-onboarding-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boas-vindas",
  description: "Configure sua jornada personalizada no Saúde & Bem.",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  await requireUser();
  const data = await getOnboardingData();

  return (
    <Section background="default" spacing="default">
      <Container>
        <OnboardingWizard data={data} />
      </Container>
    </Section>
  );
}
