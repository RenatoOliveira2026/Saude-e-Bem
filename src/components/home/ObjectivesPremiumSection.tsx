import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Icon, IconBox } from "@/components/icons";
import { Section } from "@/components/ui/Section";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { premiumObjectives } from "@/lib/home-premium";
import Link from "next/link";

export function ObjectivesPremiumSection() {
  return (
    <Section background="white" id="objetivos" spacing="spacious">
      <HomeSectionHeader
        label="Seu caminho"
        title="Escolha seu objetivo"
        description="Cada meta conecta você a protocolos, artigos e materiais selecionados para a sua jornada."
        align="center"
        className="mb-14"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {premiumObjectives.map((objective) => (
          <Link key={objective.title} href={objective.href} className="group block">
            <Card
              variant="default"
              hover
              padding="lg"
              className="h-full border-border/60 bg-off-white/80 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-card"
            >
              <IconBox name={objective.icon} size={22} className="mb-5 bg-surface shadow-soft" />
              <CardHeader className="mb-0">
                <CardTitle className="text-lg group-hover:text-sage transition-colors">
                  {objective.title}
                </CardTitle>
                <CardDescription className="mt-2 text-sm leading-relaxed">
                  {objective.description}
                </CardDescription>
              </CardHeader>
              <span className="mt-6 inline-flex items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-wider text-forest">
                Explorar conteúdo
                <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
