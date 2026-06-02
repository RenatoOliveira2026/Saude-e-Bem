import type { Metadata } from "next";

const SITE_NAME = "Saúde & Bem";

interface ContentMetadataInput {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  type?: "article" | "website";
}

export function buildContentMetadata({
  title,
  description,
  path,
  imageUrl,
  type = "website",
}: ContentMetadataInput): Metadata {
  const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001").replace(
    /\/$/,
    "",
  );
  const url = path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      ...(imageUrl ? { images: [{ url: imageUrl, alt: title }] } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: pageTitle,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
