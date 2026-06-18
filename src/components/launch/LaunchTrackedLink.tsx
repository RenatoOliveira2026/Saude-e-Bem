"use client";

import {
  sendGa4ClubCtaClick,
  sendGa4GuideDownload,
  sendGa4MarketplaceCtaClick,
} from "@/lib/analytics/gtag";
import Link from "next/link";
import type { ComponentProps } from "react";

export type LaunchCtaEvent =
  | "club_cta_click"
  | "marketplace_cta_click"
  | "guide_download";

interface LaunchTrackedLinkProps extends ComponentProps<typeof Link> {
  event: LaunchCtaEvent;
  ctaLabel: string;
}

export function LaunchTrackedLink({
  event,
  ctaLabel,
  href,
  onClick,
  children,
  ...rest
}: LaunchTrackedLinkProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const sourcePage = window.location.pathname;
    const destination = typeof href === "string" ? href : href.pathname ?? "";

    if (event === "club_cta_click") {
      sendGa4ClubCtaClick({ sourcePage, ctaLabel, destination });
    } else if (event === "marketplace_cta_click") {
      sendGa4MarketplaceCtaClick({ sourcePage, ctaLabel, destination });
    } else if (event === "guide_download") {
      sendGa4GuideDownload({ sourcePage, source: "launch_cta" });
    }

    onClick?.(e);
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
