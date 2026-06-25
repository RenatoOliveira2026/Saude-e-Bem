"use client";

import { sendGa4ArticleRead } from "@/lib/analytics/growth-events";
import { useEffect } from "react";

interface ArticleReadTrackerProps {
  slug: string;
  title: string;
}

export function ArticleReadTracker({ slug, title }: ArticleReadTrackerProps) {
  useEffect(() => {
    sendGa4ArticleRead({ contentSlug: slug, contentTitle: title, source: "article_page" });
  }, [slug, title]);
  return null;
}
