"use client";

import { ContentErrorState, CrossLinks } from "@/components/pages";
import { PageHero } from "@/components/layout/PageHero";

export default function ProtocolosError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <PageHero
        badge="Protocolos"
        title="Rotinas que transformam sua saúde"
        description="Planos passo a passo desenvolvidos com base científica."
      />
      <ContentErrorState onRetry={reset} />
      <CrossLinks />
    </>
  );
}
