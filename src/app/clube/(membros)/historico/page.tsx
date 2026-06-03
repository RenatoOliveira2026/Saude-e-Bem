import { ClubAccessHistoryList } from "@/components/club";
import { getClubDashboardData } from "@/lib/club/get-club-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Histórico de acessos — Clube Saúde & Bem",
};

export default async function ClubeHistoricoPage() {
  const data = await getClubDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-forest">
          Histórico de acessos
        </h1>
        <p className="mt-2 text-muted">
          Conteúdos que você visitou recentemente na plataforma.
        </p>
      </div>
      <ClubAccessHistoryList entries={data.accessHistory} />
    </div>
  );
}
