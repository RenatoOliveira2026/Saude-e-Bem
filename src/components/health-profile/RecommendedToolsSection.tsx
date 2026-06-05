import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/icons";
import type { RecommendedTool } from "@/lib/recommendations/recommendation-types";
import { routes } from "@/lib/routes";
import Link from "next/link";

export function RecommendedToolsSection({
  tools,
}: {
  tools: RecommendedTool[];
}) {
  if (tools.length === 0) {
    return (
      <p className="text-sm text-muted">
        Você já utilizou todas as ferramentas principais. Refaça periodicamente para
        atualizar seu score.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tools.map((tool) => (
        <Card key={tool.toolSlug} variant="outline" padding="md" hover>
          <Badge variant="outline" className="text-xs">
            Prioridade {tool.priority}
          </Badge>
          <h3 className="mt-3 font-heading text-lg text-forest">{tool.toolTitle}</h3>
          <p className="mt-2 text-sm text-muted text-pretty">{tool.reason}</p>
          <Link
            href={tool.href}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-sage"
          >
            Abrir ferramenta
            <Icon name="arrow-right" size={16} />
          </Link>
        </Card>
      ))}
      <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
        <Button href={routes.ferramentas} variant="secondary" size="md">
          Ver todas as ferramentas
        </Button>
      </div>
    </div>
  );
}
