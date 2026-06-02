import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/Section";
import { healthProfiles } from "@/lib/home-content";
import { routes } from "@/lib/routes";

export function HealthProfileSection() {
  return (
    <Section background="white" id="perfil-saude">
      <SectionHeader>
        <SectionLabel>Personalização</SectionLabel>
        <SectionTitle>Descubra seu Perfil de Saúde</SectionTitle>
        <SectionDescription>
          Cada corpo é único. Identifique seu perfil dominante e receba
          recomendações alinhadas à sua biologia e estilo de vida.
        </SectionDescription>
      </SectionHeader>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {healthProfiles.map((profile) => (
          <Card key={profile.id} variant="muted" hover padding="lg" className="flex flex-col">
            <span
              className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface text-xl text-gold shadow-soft"
              aria-hidden="true"
            >
              {profile.icon}
            </span>
            <CardHeader className="mb-0 flex-1">
              <CardTitle className="text-lg">{profile.title}</CardTitle>
              <CardDescription className="mt-3 text-sm leading-relaxed">
                {profile.description}
              </CardDescription>
            </CardHeader>
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.traits.map((trait) => (
                <Badge key={trait} variant="outline" className="text-[0.65rem]">
                  {trait}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 text-center">
        <p className="max-w-lg text-muted text-pretty">
          Leva menos de 3 minutos. Sem cadastro obrigatório para a versão
          gratuita.
        </p>
        <Button href={routes.ferramentas} size="lg">
          Fazer avaliação gratuita
        </Button>
      </div>
    </Section>
  );
}
