"use client";

import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import {
  sendGa4ClubCtaClick,
  sendGa4GuideDownload,
  sendGa4MarketplaceCtaClick,
} from "@/lib/analytics/gtag";
import { routes } from "@/lib/routes";

interface LaunchFunnelCtaProps {
  title?: string;
  description?: string;
  background?: "forest" | "sage" | "gold" | "white";
  showMarketplace?: boolean;
}

function trackCta(
  event: "club_cta_click" | "marketplace_cta_click" | "guide_download",
  ctaLabel: string,
  destination: string,
) {
  const sourcePage = window.location.pathname;
  if (event === "club_cta_click") {
    sendGa4ClubCtaClick({ sourcePage, ctaLabel, destination });
  } else if (event === "marketplace_cta_click") {
    sendGa4MarketplaceCtaClick({ sourcePage, ctaLabel, destination });
  } else {
    sendGa4GuideDownload({ sourcePage, source: "launch_cta" });
  }
}

export function LaunchFunnelCta({
  title = "Comece sua jornada com o Saúde & Bem",
  description = "Entre na lista VIP, baixe materiais gratuitos e explore recursos curados para sua saúde e longevidade.",
  background = "sage",
  showMarketplace = false,
}: LaunchFunnelCtaProps) {
  const isForest = background === "forest";

  return (
    <Section background={background} spacing="compact">
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className={`font-heading text-2xl text-balance md:text-3xl ${
            isForest ? "text-off-white" : "text-forest"
          }`}
        >
          {title}
        </h2>
        <p
          className={`mt-4 leading-relaxed text-pretty ${
            isForest ? "text-off-white/70" : "text-muted"
          }`}
        >
          {description}
        </p>
        <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
          <Button href={`${routes.lancamento}#lista-vip`} variant="gold" size="md">
            Entrar na lista VIP
          </Button>
          <Button
            href={routes.guia30Dias}
            variant={isForest ? "outline" : "primary"}
            size="md"
            className={
              isForest
                ? "border-off-white/30 text-off-white hover:bg-off-white/10 hover:text-off-white"
                : undefined
            }
            onClick={() => trackCta("guide_download", "Baixar guia gratuito", routes.guia30Dias)}
          >
            Baixar guia gratuito
          </Button>
          <Button
            href={routes.clube}
            variant="outline"
            size="md"
            className={
              isForest
                ? "border-off-white/30 text-off-white hover:bg-off-white/10 hover:text-off-white"
                : undefined
            }
            onClick={() => trackCta("club_cta_click", "Conhecer o Clube", routes.clube)}
          >
            Conhecer o Clube
          </Button>
          {showMarketplace ? (
            <Button
              href={routes.marketplace}
              variant="outline"
              size="md"
              onClick={() =>
                trackCta(
                  "marketplace_cta_click",
                  "Ver recursos recomendados",
                  routes.marketplace,
                )
              }
            >
              Ver recursos recomendados
            </Button>
          ) : (
            <Button href={routes.recomendados} variant="outline" size="md">
              Ver recursos recomendados
            </Button>
          )}
        </div>
      </div>
    </Section>
  );
}
