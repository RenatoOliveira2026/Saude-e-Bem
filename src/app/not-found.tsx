import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "A página solicitada não existe ou foi movida.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-heading text-sm uppercase tracking-[0.2em] text-sage">Erro 404</p>
      <h1 className="mt-4 font-heading text-3xl font-semibold text-forest md:text-4xl">
        Página não encontrada
      </h1>
      <p className="mt-4 max-w-md text-muted leading-relaxed">
        O endereço pode estar incorreto ou a página foi removida. Explore o conteúdo
        publicado no Saúde &amp; Bem.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href={routes.home} variant="primary">
          Ir para o início
        </Button>
        <Button href={routes.blog} variant="outline">
          Ver blog
        </Button>
      </div>
    </Container>
  );
}
