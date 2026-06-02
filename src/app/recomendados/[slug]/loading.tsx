import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function RecomendadoDetailLoading() {
  return (
    <Section background="white">
      <Container size="md" className="animate-pulse py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-[4/3] rounded-2xl bg-sage-muted/40" />
          <div className="space-y-4">
            <div className="h-6 w-24 rounded-full bg-sage-muted/50" />
            <div className="h-10 w-full max-w-md rounded-lg bg-sage-muted/50" />
            <div className="h-4 w-48 rounded bg-sage-muted/40" />
            <div className="h-24 rounded-2xl bg-sage-muted/40" />
            <div className="h-12 w-48 rounded-full bg-sage-muted/50" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
