import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-sage-muted/70 ${className ?? ""}`}
    />
  );
}

export function JourneyLoading() {
  return (
    <>
      <Section background="default" spacing="compact">
        <Container>
          <Skeleton className="h-52 w-full md:h-56" />
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <Skeleton className="h-40 w-full" />
        </Container>
      </Section>

      <Section background="default">
        <Container>
          <Skeleton className="mb-8 h-8 w-64" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <Skeleton className="mb-8 h-8 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </Container>
      </Section>

      <Section background="default">
        <Container>
          <Skeleton className="mb-8 h-8 w-48" />
          <div className="space-y-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </Container>
      </Section>

      <Section background="sage" spacing="compact">
        <Container>
          <Skeleton className="h-44 w-full rounded-2xl" />
        </Container>
      </Section>
    </>
  );
}
