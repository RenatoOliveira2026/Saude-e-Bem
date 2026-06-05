import type { Metadata } from "next";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from "./site-url";

interface ContentMetadataInput {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  type?: "article" | "website";
  keywords?: string;
  publishedAt?: string;
  authors?: string[];
  noIndex?: boolean;
}

export function buildContentMetadata({
  title,
  description,
  path,
  imageUrl,
  type = "website",
  keywords,
  publishedAt,
  authors,
  noIndex = false,
}: ContentMetadataInput): Metadata {
  const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonical = absoluteUrl(path);
  const ogImage = imageUrl ? absoluteUrl(imageUrl) : absoluteUrl(DEFAULT_OG_IMAGE);

  return {
    title: pageTitle,
    description,
    ...(keywords ? { keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean) } : {}),
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type,
      locale: "pt_BR",
      ...(publishedAt && type === "article" ? { publishedTime: publishedAt } : {}),
      ...(authors?.length && type === "article" ? { authors } : {}),
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
    },
  };
}

export { SITE_NAME, absoluteUrl, getSiteUrl, DEFAULT_OG_IMAGE } from "./site-url";
