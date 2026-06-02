import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ContentCover } from "@/components/content/ContentCover";
import { categoryIcons, IconBox } from "@/components/icons";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionLabel,
  SectionTitle,
} from "@/components/ui/Section";
import type { Protocol } from "@/lib/data/types";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface ProtocolsSectionProps {
  protocols: Protocol[];
}

export function ProtocolsSection({ protocols }: ProtocolsSectionProps) {
  if (protocols.length === 0) return null;

  return (
    <Section background="default" id="protocolos">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
        <SectionHeader align="left" className="mb-0 md:max-w-xl">
          <SectionLabel>Protocolos</SectionLabel>
          <SectionTitle>Rotinas que transformam</SectionTitle>
          <SectionDescription className="text-left">
            Planos estruturados, passo a passo, desenvolvidos com base em
            evidências científicas e adaptados à sua realidade.
          </SectionDescription>
        </SectionHeader>
        <Button href={routes.protocolos} variant="outline" className="shrink-0 self-start md:self-auto">
          Ver todos
        </Button>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {protocols.map((protocol) => (
          <Link
            key={protocol.id}
            href={routes.protocolo(protocol.slug)}
            className="group block"
          >
            <Card variant="default" hover padding="lg" className="h-full">
              <ContentCover
                src={protocol.coverImageUrl}
                alt={protocol.title}
                aspect="video"
                className="mb-5"
              >
                <IconBox
                  name={categoryIcons[protocol.category]}
                  size={28}
                  className="bg-surface/90 shadow-soft"
                />
              </ContentCover>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="forest">{protocol.duration}</Badge>
                <Badge variant="outline">{protocol.level}</Badge>
                {protocol.tag && <Badge variant="gold">{protocol.tag}</Badge>}
              </div>
              <CardHeader className="mb-0 mt-5">
                <CardTitle className="group-hover:text-sage transition-colors">
                  {protocol.title}
                </CardTitle>
                <CardDescription className="mt-3 text-base leading-relaxed">
                  {protocol.description}
                </CardDescription>
              </CardHeader>
              <span className="mt-6 inline-flex items-center gap-2 font-heading text-sm font-semibold text-forest">
                Iniciar protocolo
                <span
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
