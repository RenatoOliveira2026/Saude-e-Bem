import {
  ClubBenefitsGrid,
  ClubFaq,
  ClubPricing,
  ClubStats,
  ClubTestimonials,
  ClubVipList,
  ClubWaitlist,
  CrossLinks,
} from "@/components/pages";
import { PageHero } from "@/components/layout/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clube Saúde & Bem",
  description:
    "Comunidade premium com protocolos exclusivos, ferramentas avançadas, lives e suporte dedicado à longevidade consciente.",
};

export default function ClubePage() {
  return (
    <>
      <PageHero
        badge="Exclusivo"
        title="Clube Saúde & Bem"
        description="O próximo nível da sua jornada de saúde. Acesso premium a protocolos avançados, comunidade privada, ferramentas exclusivas e acompanhamento contínuo."
      />
      <ClubStats />
      <ClubBenefitsGrid />
      <ClubVipList />
      <ClubPricing />
      <ClubTestimonials />
      <ClubFaq />
      <ClubWaitlist />
      <CrossLinks />
    </>
  );
}
