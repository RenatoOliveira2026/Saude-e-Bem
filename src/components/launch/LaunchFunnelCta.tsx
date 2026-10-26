"use client";

import { Icon, type IconName } from "@/components/icons";
import Link from "next/link";
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

interface FunnelOption {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  highlight?: boolean;
  onClick?: () => void;
}

export function LaunchFunnelCta({
  title = "Comece sua jornada com o Saúde & Bem",
  description = "Escolha por onde começar: materiais gratuitos, novidades em primeira mão ou o Clube completo.",
  background = "sage",
  showMarketplace = false,
}: LaunchFunnelCtaProps) {
  const isForest = background === "forest";

  const options: FunnelOption[] = [
    {
      title: "Baixar guia gratuito",
      description: "10 hábitos práticos para os próximos 30 dias.",
      href: routes.guia30Dias,
      icon: "download",
      highlight: true,
      onClick: () => trackCta("guide_download", "Baixar guia gratuito", routes.guia30Dias),
    },
    {
      title: "Entrar na lista VIP",
      description: "Novidades e condições especiais primeiro.",
      href: `${routes.lancamento}#lista-vip`,
      icon: "star",
    },
    {
      title: "Conhecer o Clube",
      description: "Protocolos e materiais premium completos.",
      href: routes.clube,
      icon: "community",
      onClick: () => trackCta("club_cta_click", "Conhecer o Clube", routes.clube),
    },
  ];

  const extraHref = showMarketplace ? routes.marketplace : routes.recomendados;

  return (
    <Section background={background} spacing="compact">
      <div className="mx-auto max-w-4xl text-center">
        <h2
          className={`font-heading text-2xl text-balance md:text-3xl ${
            isForest ? "text-off-white" : "text-forest"
          }`}
        >
          {title}
        </h2>
        <p
          className={`mx-auto mt-3 max-w-2xl leading-relaxed text-pretty ${
            isForest ? "text-off-white/75" : "text-muted"
          }`}
        >
          {description}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
          {options.map((option) => (
            <Link
              key={option.title}
              href={option.href}
              onClick={option.onClick}
              className={`group flex items-start gap-4 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 sm:flex-col sm:gap-3 ${
                option.highlight
                  ? isForest
                    ? "border-off-white bg-off-white text-forest shadow-card hover:shadow-elevated"
                    : "border-forest bg-forest text-off-white shadow-card hover:shadow-elevated"
                  : isForest
                    ? "border-off-white/20 bg-off-white/10 text-off-white hover:bg-off-white/15"
                    : "border-border bg-surface text-forest shadow-soft hover:border-sage hover:shadow-card"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  option.highlight
                    ? "bg-gold text-forest"
                    : isForest
                      ? "bg-off-white/15 text-gold-light"
                      : "bg-white text-sage ring-1 ring-sage/25"
                }`}
              >
                <Icon name={option.icon} size={20} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 font-heading text-base font-semibold">
                  {option.title}
                  <Icon
                    name="arrow-right"
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
                <span
                  className={`mt-1 block text-sm leading-snug ${
                    option.highlight
                      ? isForest
                        ? "text-muted"
                        : "text-off-white/80"
                      : isForest
                        ? "text-off-white/70"
                        : "text-muted"
                  }`}
                >
                  {option.description}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <Link
          href={extraHref}
          onClick={
            showMarketplace
              ? () =>
                  trackCta("marketplace_cta_click", "Ver recursos recomendados", routes.marketplace)
              : undefined
          }
          className={`mt-6 inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-semibold underline-offset-4 hover:underline ${
            isForest ? "text-gold-light" : "text-sage"
          }`}
        >
          Ver recursos recomendados
          <Icon name="arrow-right" size={16} aria-hidden />
        </Link>
      </div>
    </Section>
  );
}
