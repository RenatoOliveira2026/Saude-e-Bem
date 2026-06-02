import { ProfileForm } from "@/components/auth/ProfileForm";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getSessionProfile } from "@/lib/auth/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil",
  description: "Gerencie suas informações pessoais no Saúde & Bem.",
};

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export default async function PerfilPage() {
  const { user, profile } = await getSessionProfile();

  return (
    <>
      <PageHero
        badge="Conta"
        title="Meu perfil"
        description="Atualize suas informações pessoais e objetivo de saúde."
      />
      <Section background="white">
        <Container size="sm">
          <p className="mb-8 text-center text-sm text-muted">
            Membro desde{" "}
            {formatDate(profile.profile?.created_at ?? user.created_at)}
          </p>
          <ProfileForm
            profile={profile.profile}
            preferences={profile.preferences}
            email={user.email ?? ""}
          />
        </Container>
      </Section>
    </>
  );
}
