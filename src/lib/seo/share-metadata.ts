import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from "./site-url";

export interface ShareOgInput {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  type?: "article" | "website";
}

/** Metadados OG otimizados para compartilhamento (Fase 9.5). */
export function buildShareOgTags(input: ShareOgInput) {
  const url = absoluteUrl(input.path);
  const image = input.imageUrl
    ? absoluteUrl(input.imageUrl)
    : absoluteUrl(DEFAULT_OG_IMAGE);

  return {
    url,
    title: input.title.includes(SITE_NAME) ? input.title : `${input.title} | ${SITE_NAME}`,
    description: input.description,
    image,
    siteName: SITE_NAME,
    type: input.type ?? "website",
  };
}

export function buildWhatsAppShareUrl(text: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
}

export function buildTwitterShareUrl(text: string, url: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}
