import { HealthProfileDashboard } from "@/components/health-profile/HealthProfileDashboard";
import { LeadCaptureSection } from "@/components/leads";
import { CrossLinks } from "@/components/pages";
import { getHealthProfileData } from "@/lib/health-profile/get-health-profile-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Saúde",
  description:
    "Acompanhe resultados das ferramentas interativas e receba recomendações personalizadas de protocolos.",
};

export default async function MinhaSaudePage() {
  const data = await getHealthProfileData();

  return (
    <>
      <HealthProfileDashboard data={data} />
      <LeadCaptureSection source="minha-saude" />
      <CrossLinks />
    </>
  );
}
