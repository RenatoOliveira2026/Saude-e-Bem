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
import { Section } from "@/components/ui/Section";
import { HomeEmptyNote } from "@/components/home/HomeEmptyNote";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import type { Protocol } from "@/lib/data/types";
import { routes } from "@/lib/routes";

interface ProtocolsPremiumSectionProps {
  protocols: Protocol[];
}

export function ProtocolsPremiumSection({ protocols }: ProtocolsPremiumSectionProps) {
  return (
    <Section background="sage" id="protocolos" spacing="spacious">
      <HomeSectionHeader
        label="Protocolos Saúde & Bem"
        title="Rotinas que transformam"
        description="Planos estruturados, passo a passo, com base científica — do iniciante ao avançado."
        actionLabel="Ver todos"
        actionHref={routes.protocolos}
        className="mb-14"
      />

      {protocols.length === 0 ? (
        <HomeEmptyNote message="Novos protocolos serão publicados em breve. Enquanto isso, explore artigos e ferramentas gratuitas." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {protocols.map((protocol) => (
            <Card
              key={protocol.id}
              variant="default"
              hover
              padding="lg"
              className="flex h-full flex-col border-transparent bg-surface/90 backdrop-blur-sm"
            >
              <ContentCover
                src={protocol.coverImageUrl}
                alt={protocol.title}
                aspect="video"
                className="mb-5"
              >
                <IconBox
                  name={categoryIcons[protocol.category]}
                  size={28}
                  className="bg-surface shadow-soft"
                />
              </ContentCover>
              <div className="flex flex-wrap gap-2">
                <Badge variant="forest">{protocol.duration}</Badge>
                <Badge variant="outline">{protocol.level}</Badge>
                {protocol.tag && <Badge variant="gold">{protocol.tag}</Badge>}
              </div>
              <CardHeader className="mb-0 mt-4 flex-1">
                <CardTitle className="text-xl">{protocol.title}</CardTitle>
                <CardDescription className="mt-2 text-base leading-relaxed">
                  {protocol.description}
                </CardDescription>
              </CardHeader>
              <Button
                href={routes.protocolo(protocol.slug)}
                variant="primary"
                size="sm"
                className="mt-6 w-full justify-center sm:w-auto"
              >
                Ver protocolo
              </Button>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
