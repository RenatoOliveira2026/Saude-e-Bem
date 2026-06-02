"use client";

import { ContentErrorState, CrossLinks } from "@/components/pages";
import { PageHero } from "@/components/layout/PageHero";

export default function BibliotecaError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <PageHero
        badge="Biblioteca"
        title="Recursos curados para sua evolução"
        description="Materiais selecionados pela equipe Saúde & Bem."
      />
      <ContentErrorState onRetry={reset} />
      <CrossLinks />
    </>
  );
}
