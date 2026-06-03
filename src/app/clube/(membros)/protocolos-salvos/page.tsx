import { ClubSavedProtocolsList } from "@/components/club";
import { getClubDashboardData } from "@/lib/club/get-club-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protocolos salvos — Clube Saúde & Bem",
};

export default async function ClubeProtocolosSalvosPage() {
  const data = await getClubDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-forest">Protocolos salvos</h1>
        <p className="mt-2 text-muted">
          Acompanhe o progresso dos protocolos que você salvou.
        </p>
      </div>
      <ClubSavedProtocolsList protocols={data.savedProtocols} />
    </div>
  );
}
