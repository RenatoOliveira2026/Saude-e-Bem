"use client";

import { trackAnalyticsFromClientAction } from "@/lib/analytics/actions";
import Link from "next/link";
import type { ComponentProps } from "react";

interface TrackedDownloadLinkProps extends ComponentProps<typeof Link> {
  contentId: string;
  contentTitle: string;
  sourcePage: string;
}

export function TrackedDownloadLink({
  contentId,
  contentTitle,
  sourcePage,
  onClick,
  ...props
}: TrackedDownloadLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        void trackAnalyticsFromClientAction({
          eventType: "ebook_download",
          sourcePage,
          sourceType: "download_button",
          contentId,
          contentTitle,
          metadata: { slug: contentId },
        });
        onClick?.(event);
      }}
    />
  );
}
