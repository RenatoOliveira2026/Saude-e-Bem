import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { routes } from "@/lib/routes";

export default function RecomendadoNotFound() {
  return (
    <Section background="white">
      <Container className="py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
          Recurso não encontrado
        </p>
        <h1 className="mt-4 font-heading text-3xl text-forest">
          Este recomendado não está disponível
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted">
          O produto pode ter sido desativado ou o endereço está incorreto.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={routes.recomendados} variant="primary">
            Ver recomendados
          </Button>
          <Button href={routes.home} variant="outline">
            Voltar ao início
          </Button>
        </div>
      </Container>
    </Section>
  );
}
