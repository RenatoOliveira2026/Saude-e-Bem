import { Badge } from "@/components/ui/Badge";
import { ContentBadge } from "@/components/subscription/ContentBadge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ContentCover } from "@/components/content/ContentCover";
import { categoryIcons, Icon, IconBox } from "@/components/icons";
import { routes } from "@/lib/routes";
import type { Protocol } from "@/lib/data/types";

export function FeaturedProtocolBanner({ protocol }: { protocol: Protocol }) {
  return (
    <Card variant="featured" padding="lg" className="overflow-hidden">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <IconBox name={categoryIcons[protocol.category]} size={22} className="mb-4" />
          <div className="flex flex-wrap gap-2">
            {protocol.tag && <Badge variant="gold">{protocol.tag}</Badge>}
            <Badge variant="forest">{protocol.categoryLabel}</Badge>
          </div>
          <h2 className="mt-4 font-heading text-2xl text-forest md:text-3xl">
            {protocol.title}
          </h2>
          <p className="mt-3 text-muted leading-relaxed">{protocol.description}</p>
          <p className="mt-3 text-sm font-medium text-forest">
            Objetivo: <span className="font-normal text-muted">{protocol.objective}</span>
          </p>
          <div className="mt-6">
            <Button href={routes.protocolo(protocol.slug)} size="md">
              Ver protocolo
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 rounded-xl bg-sage-muted/50 p-6 md:p-8">
          {[
            { icon: "clock" as const, value: protocol.duration, label: "Tempo" },
            { icon: "activity" as const, value: protocol.level, label: "Nível" },
            { icon: "users" as const, value: protocol.participants.toLocaleString("pt-BR"), label: "Participantes" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <Icon name={stat.icon} size={20} className="mx-auto text-sage" />
              <p className="mt-2 font-heading text-lg font-bold text-forest md:text-xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function ProtocolCard({ protocol }: { protocol: Protocol }) {
  const href = routes.protocolo(protocol.slug);
  const icon =
    categoryIcons[protocol.category as keyof typeof categoryIcons] ??
    categoryIcons.sono;

  return (
    <Card variant="default" hover padding="lg" className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <ContentCover
          src={protocol.coverImageUrl}
          alt={protocol.title}
          className="h-16 w-16 shrink-0"
        >
          <IconBox name={icon} size={20} />
        </ContentCover>
        <div className="flex flex-wrap justify-end gap-2">
          <ContentBadge variant={protocol.isPremium ? "premium" : "free"} />
        </div>
      </div>
      <CardHeader className="mb-0 mt-4 flex-1">
        <CardTitle className="text-lg">{protocol.title}</CardTitle>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          {protocol.description}
        </CardDescription>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          <span className="font-semibold text-forest">Objetivo: </span>
          {protocol.objective}
        </p>
      </CardHeader>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline">{protocol.level}</Badge>
        <Badge variant="outline">{protocol.duration}</Badge>
      </div>
      <div className="mt-6 border-t border-border pt-4">
        <Button
          href={href}
          variant={protocol.isPremium ? "gold" : "primary"}
          size="sm"
          className="w-full justify-center"
        >
          {protocol.isPremium ? "Ver detalhes" : "Ver protocolo"}
        </Button>
      </div>
    </Card>
  );
}
