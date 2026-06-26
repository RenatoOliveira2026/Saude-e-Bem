"use client";

import { sendGa4RecommendationClick } from "@/lib/analytics/growth-events";
import type { IntelligentRecommendation } from "@/lib/recommendation-engine/types";
import Link from "next/link";
import type { ReactNode } from "react";

interface RecommendationLinkProps {
  item: Pick<IntelligentRecommendation, "id" | "type" | "slug" | "title" | "href" | "kind">;
  source: string;
  className?: string;
  children: ReactNode;
}

export function RecommendationLink({
  item,
  source,
  className,
  children,
}: RecommendationLinkProps) {
  return (
    <Link
      href={item.href}
      className={className}
      onClick={() =>
        sendGa4RecommendationClick({
          source,
          contentType: item.type,
          contentSlug: item.slug,
          contentTitle: item.title,
          origin: item.kind,
        })
      }
    >
      {children}
    </Link>
  );
}
