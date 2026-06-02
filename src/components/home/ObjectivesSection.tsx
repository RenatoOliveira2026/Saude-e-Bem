import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/Section";
import { objectives } from "@/lib/home-content";
import Link from "next/link";

export function ObjectivesSection() {
  return (
    <Section background="sage" id="objetivos">
      <SectionHeader>
        <SectionLabel>Seu caminho</SectionLabel>
        <SectionTitle>Escolha seu Objetivo</SectionTitle>
        <SectionDescription>
          Selecione a meta que mais ressoa com você hoje. Cada objetivo
          desbloqueia protocolos e ferramentas específicas.
        </SectionDescription>
      </SectionHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {objectives.map((objective) => (
          <Link key={objective.title} href={objective.href} className="group block">
            <Card
              variant="default"
              hover
              padding="md"
              className="h-full border-transparent bg-surface/80 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-muted text-2xl"
                  aria-hidden="true"
                >
                  {objective.icon}
                </span>
                <CardHeader className="mb-0 min-w-0">
                  <CardTitle className="text-lg group-hover:text-sage transition-colors">
                    {objective.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm">
                    {objective.description}
                  </CardDescription>
                </CardHeader>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 font-heading text-xs font-semibold uppercase tracking-wider text-forest opacity-0 transition-opacity group-hover:opacity-100">
                Explorar
                <span aria-hidden="true">→</span>
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
