import type { NewsletterSource } from "@/lib/newsletter/types";

export const NEWSLETTER_SOURCE_LABELS: Record<NewsletterSource, string> = {
  home: "Home",
  blog: "Blog",
  biblioteca: "Biblioteca",
  clube: "Clube",
  other: "Outro",
};

export function isNewsletterSource(value: string): value is NewsletterSource {
  return value in NEWSLETTER_SOURCE_LABELS;
}

export function parseNewsletterSource(value: string): NewsletterSource {
  return isNewsletterSource(value) ? value : "other";
}
