import { ProfileForm } from "@/components/auth/ProfileForm";
import { getSessionProfile } from "@/lib/auth/session";
import { formatSubscriptionDate, membershipPlanLabels } from "@/lib/club/constants";
import { getClubMembership } from "@/lib/club/access";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil — Clube Saúde & Bem",
};

export default async function ClubePerfilPage() {
  const { user, profile } = await getSessionProfile();
  const membership = await getClubMembership(user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-forest">Meu perfil</h1>
        <p className="mt-2 text-muted">
          Plano {membershipPlanLabels[membership.plan]}
          {membership.expiresAt &&
            membership.isPremium &&
            ` · válido até ${formatSubscriptionDate(membership.expiresAt)}`}
        </p>
      </div>
      <ProfileForm
        profile={profile.profile}
        preferences={profile.preferences}
        email={user.email ?? ""}
      />
    </div>
  );
}
