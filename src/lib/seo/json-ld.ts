import { absoluteUrl, getSiteUrl, SITE_NAME } from "./site-url";

export type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url,
    logo: absoluteUrl("/logo-saude-bem.png"),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteUrl(),
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function homeWebPageJsonLd(input: {
  title: string;
  description: string;
}): JsonLd {
  return webPageJsonLd({ ...input, path: "/" });
}

export function webPageJsonLd(input: {
  title: string;
  description: string;
  path: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path?: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  author: string;
  publishedAt?: string;
  isPremium?: boolean;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.imageUrl ? absoluteUrl(input.imageUrl) : absoluteUrl("/logo-saude-bem.png"),
    author: { "@type": "Person", name: input.author },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: absoluteUrl("/logo-saude-bem.png") },
    ...(input.publishedAt ? { datePublished: input.publishedAt } : {}),
    isAccessibleForFree: !input.isPremium,
  };
}

export function bookJsonLd(input: {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  isPremium?: boolean;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.imageUrl ? absoluteUrl(input.imageUrl) : absoluteUrl("/logo-saude-bem.png"),
    isAccessibleForFree: !input.isPremium,
  };
}

export function productJsonLd(input: {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  price?: number | null;
  currency?: string;
}): JsonLd {
  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.imageUrl ? absoluteUrl(input.imageUrl) : absoluteUrl("/logo-saude-bem.png"),
    brand: { "@type": "Brand", name: SITE_NAME },
  };
  if (input.price != null) {
    data.offers = {
      "@type": "Offer",
      price: input.price,
      priceCurrency: input.currency ?? "BRL",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(input.path),
    };
  }
  return data;
}
