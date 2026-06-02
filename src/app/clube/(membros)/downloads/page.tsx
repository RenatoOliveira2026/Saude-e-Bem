import { ClubDownloadsList } from "@/components/club";
import { getClubDashboardData } from "@/lib/club/get-club-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Downloads — Clube Saúde & Bem",
};

export default async function ClubeDownloadsPage() {
  const data = await getClubDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-forest">Downloads</h1>
        <p className="mt-2 text-muted">
          Histórico de materiais baixados na plataforma.
        </p>
      </div>
      <ClubDownloadsList downloads={data.downloads} />
    </div>
  );
}
