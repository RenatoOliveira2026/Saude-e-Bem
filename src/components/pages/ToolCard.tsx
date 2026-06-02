import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Icon, IconBox } from "@/components/icons";
import { routes } from "@/lib/routes";
import type { Tool } from "@/lib/data/types";

export function ToolCard({ tool }: { tool: Tool }) {
  const href = routes.ferramenta(tool.slug);

  return (
    <Card variant="muted" hover padding="lg" className="flex h-full flex-col">
      <div className="flex items-start gap-4">
        <IconBox name={tool.icon} size={24} className="shrink-0 bg-surface shadow-soft" />
        <div className="min-w-0 flex-1">
          <Badge variant="default">{tool.categoryLabel}</Badge>
          <CardHeader className="mb-0 mt-2">
            <CardTitle className="text-lg">{tool.title}</CardTitle>
            <CardDescription className="mt-2 text-sm leading-relaxed">
              {tool.description}
            </CardDescription>
          </CardHeader>
        </div>
      </div>
      <div className="mt-auto flex items-center gap-1.5 pt-6 text-xs text-muted">
        <Icon name="clock" size={14} />
        {tool.duration}
      </div>
      <div className="mt-4 border-t border-border pt-4">
        <Button href={href} variant="secondary" size="sm" className="w-full justify-center">
          Acessar ferramenta
        </Button>
      </div>
    </Card>
  );
}

export function FeaturedToolBanner({ tool }: { tool: Tool }) {
  return (
    <Card variant="featured" padding="lg">
      <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
        <IconBox name={tool.icon} size={26} className="bg-gold-muted text-forest" />
        <div>
          <Badge variant="gold" className="mb-3">
            Ferramenta em destaque
          </Badge>
          <h2 className="font-heading text-xl text-forest md:text-2xl">
            {tool.title}
          </h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            {tool.description}
          </p>
        </div>
        <Button href={routes.ferramenta(tool.slug)} size="md" className="shrink-0">
          Acessar ferramenta
        </Button>
      </div>
    </Card>
  );
}
