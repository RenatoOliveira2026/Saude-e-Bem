import { ClubFavoritesList } from "@/components/club";
import { getClubDashboardData } from "@/lib/club/get-club-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favoritos — Clube Saúde & Bem",
};

export default async function ClubeFavoritosPage() {
  const data = await getClubDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-forest">Favoritos</h1>
        <p className="mt-2 text-muted">
          Conteúdos que você salvou para consultar depois.
        </p>
      </div>
      <ClubFavoritesList favorites={data.favorites} />
    </div>
  );
}
