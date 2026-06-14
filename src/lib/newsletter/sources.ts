import type { NewsletterSource } from "@/lib/newsletter/types";

export const NEWSLETTER_SOURCE_LABELS: Record<NewsletterSource, string> = {
  home: "Home",
  blog: "Blog",
  biblioteca: "Biblioteca",
  protocolos: "Protocolos",
  footer: "Rodapé",
  popup: "Popup",
  "guia-30-dias": "Guia 30 dias",
  clube: "Clube",
  other: "Outro",
};

export const NEWSLETTER_SOURCES = Object.keys(
  NEWSLETTER_SOURCE_LABELS,
) as NewsletterSource[];

export function isNewsletterSource(value: string): value is NewsletterSource {
  return value in NEWSLETTER_SOURCE_LABELS;
}

export function parseNewsletterSource(value: string): NewsletterSource {
  return isNewsletterSource(value) ? value : "other";
}
