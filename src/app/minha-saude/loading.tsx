import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function MinhaSaudeLoading() {
  return (
    <Section background="default">
      <Container>
        <div className="animate-pulse space-y-4 rounded-2xl border border-border bg-surface p-10">
          <div className="h-4 w-32 rounded bg-sage-muted" />
          <div className="h-10 w-64 rounded bg-sage-muted" />
          <div className="h-4 w-full max-w-xl rounded bg-sage-muted" />
        </div>
      </Container>
    </Section>
  );
}
