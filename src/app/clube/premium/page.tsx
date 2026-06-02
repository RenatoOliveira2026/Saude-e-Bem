import { ClubPremiumPage } from "@/components/club";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium — Clube Saúde & Bem",
  description:
    "Assinatura premium do Clube Saúde & Bem — protocolos exclusivos, biblioteca ampliada e conteúdos avançados.",
};

export default function ClubePremiumRoutePage() {
  return (
    <Section background="white">
      <Container size="md">
        <ClubPremiumPage />
      </Container>
    </Section>
  );
}
