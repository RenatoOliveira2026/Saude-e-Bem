import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section, SectionTitle } from "@/components/ui/Section";
import { thankYouRecommendations } from "@/lib/conversion/conversion-mapping";
import Link from "next/link";

interface ThankYouRecommendationsProps {
  interest?: string | null;
}

export function ThankYouRecommendations({ interest }: ThankYouRecommendationsProps) {
  const items = thankYouRecommendations(interest);

  return (
    <Section background="sage" spacing="compact">
      <Container size="md">
        <SectionTitle className="text-center text-2xl">Próximos passos recomendados</SectionTitle>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted">
          Enquanto preparamos seus materiais, explore conteúdos alinhados ao seu interesse.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="group block h-full">
              <Card variant="default" hover padding="lg" className="h-full">
                <CardHeader className="mb-0">
                  <CardTitle className="text-base group-hover:text-sage transition-colors">
                    {item.label}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
