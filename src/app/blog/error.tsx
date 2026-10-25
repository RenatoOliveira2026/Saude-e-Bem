"use client";

import { ContentErrorState, CrossLinks } from "@/components/pages";
import { PageHero } from "@/components/layout/PageHero";

export default function BlogError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <PageHero
        badge="Blog"
        title="Artigos & insights de saúde"
        description="Conteúdo da equipe Saúde & Bem para informar, inspirar e traduzir ciência em ações práticas."
      />
      <ContentErrorState onRetry={reset} />
      <CrossLinks />
    </>
  );
}
