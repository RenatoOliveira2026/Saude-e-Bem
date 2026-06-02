import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/Section";
import { clubBenefits } from "@/lib/home-content";
import { routes } from "@/lib/routes";

export function ClubSection() {
  return (
    <Section background="forest" id="clube" spacing="spacious">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionHeader align="left" className="mb-0 max-w-none">
          <SectionLabel className="text-gold/80">Exclusivo</SectionLabel>
          <SectionTitle className="text-off-white">
            Clube Saúde & Bem
          </SectionTitle>
          <SectionDescription className="text-left text-off-white/70">
            O próximo nível da sua jornada. Acesso premium a protocolos
            avançados, comunidade dedicada e acompanhamento contínuo.
          </SectionDescription>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={routes.clube} variant="gold" size="lg">
              Quero fazer parte
            </Button>
            <Button
              href={routes.clube}
              variant="ghost"
              size="lg"
              className="border border-off-white/20 text-off-white hover:bg-off-white/10 hover:text-off-white"
            >
              Conhecer benefícios
            </Button>
          </div>
        </SectionHeader>

        <div className="rounded-2xl border border-off-white/10 bg-off-white/5 p-8 backdrop-blur-sm md:p-10">
          <Badge variant="gold" className="mb-6">
            Membros premium
          </Badge>
          <ul className="space-y-4">
            {clubBenefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs text-gold"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span className="text-sm leading-relaxed text-off-white/85">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl border border-gold/20 bg-gold/10 p-5">
            <p className="font-heading text-sm font-semibold text-gold">
              Lançamento em breve
            </p>
            <p className="mt-1 text-sm text-off-white/60">
              Cadastre-se na newsletter e garanta acesso antecipado com
              condições especiais.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
