import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function RecomendadosLoading() {
  return (
    <>
      <PageHero
        badge="Curadoria"
        title="Recursos recomendados"
        description="Carregando seleção editorial…"
      />
      <Section background="white">
        <Container>
          <div className="animate-pulse space-y-6">
            <div className="h-10 max-w-md rounded-full bg-sage-muted/50" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-sage-muted/40" />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
