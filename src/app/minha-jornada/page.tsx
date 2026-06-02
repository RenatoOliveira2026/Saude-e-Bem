import { JourneyDashboard } from "@/components/journey/JourneyDashboard";
import { getJourneyData } from "@/lib/journey/get-journey-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha Jornada",
  description:
    "Seu dashboard personalizado de saúde e bem-estar — objetivos, protocolos, progresso e materiais curados.",
};

export default async function MinhaJornadaPage() {
  const data = await getJourneyData();

  return <JourneyDashboard data={data} />;
}
