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
import { freeTools } from "@/lib/home-content";
import { routes } from "@/lib/routes";
import Link from "next/link";

export function FreeToolsSection() {
  return (
    <Section background="white" id="ferramentas">
      <SectionHeader>
        <Badge variant="gold" className="mb-4">
          100% Gratuito
        </Badge>
        <SectionLabel>Ferramentas</SectionLabel>
        <SectionTitle>Ferramentas Gratuitas</SectionTitle>
        <SectionDescription>
          Recursos interativos para você entender melhor seu corpo e tomar
          decisões mais conscientes — sem custo, sem compromisso.
        </SectionDescription>
      </SectionHeader>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {freeTools.map((tool) => (
          <Link key={tool.title} href={tool.href} className="group block">
            <Card
              variant="muted"
              hover
              padding="md"
              className="h-full text-center sm:text-left"
            >
              <span
                className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-2xl shadow-soft sm:mx-0"
                aria-hidden="true"
              >
                {tool.icon}
              </span>
              <CardHeader className="mb-0 mt-4">
                <CardTitle className="text-base">{tool.title}</CardTitle>
                <CardDescription className="mt-2 text-sm">
                  {tool.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button href={routes.ferramentas} variant="secondary">
          Acessar todas as ferramentas
        </Button>
      </div>
    </Section>
  );
}
