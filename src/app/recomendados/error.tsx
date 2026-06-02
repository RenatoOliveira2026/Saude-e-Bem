"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { routes } from "@/lib/routes";

export default function RecomendadosError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Section background="white">
      <Container className="py-20 text-center">
        <h1 className="font-heading text-2xl text-forest">
          Não foi possível carregar os recomendados
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Ocorreu um problema ao buscar os recursos. Tente novamente em instantes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button type="button" variant="primary" onClick={reset}>
            Tentar novamente
          </Button>
          <Button href={routes.home} variant="outline">
            Voltar ao início
          </Button>
        </div>
      </Container>
    </Section>
  );
}
