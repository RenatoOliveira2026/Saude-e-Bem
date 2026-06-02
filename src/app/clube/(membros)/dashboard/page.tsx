import { ClubDashboard } from "@/components/club";
import { getClubDashboardData } from "@/lib/club/get-club-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Clube Saúde & Bem",
  description: "Painel do membro com plano, favoritos e downloads.",
};

export default async function ClubeDashboardPage() {
  const data = await getClubDashboardData();
  return <ClubDashboard data={data} />;
}
