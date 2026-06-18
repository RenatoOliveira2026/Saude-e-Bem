import { parseContentBlocks } from "@/lib/admin/cms/content-blocks";
import generated from "./seo-articles-71a.generated.json";
import type { BlogCategory } from "@/lib/data/types";

export interface SeoArticleSeedRow {
  slug: string;
  title: string;
  excerpt: string;
  content: unknown[];
  category: string;
  category_label: string;
  author: string;
  author_role: string;
  read_time: string;
  published_at: string;
  featured: boolean;
  is_premium: boolean;
  cover_image_url?: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image_url: string;
}

/** 20 artigos SEO — Fase 7.1A (gerado por npm run generate:seo-articles) */
export const SEO_ARTICLES_71A: SeoArticleSeedRow[] =
  generated as SeoArticleSeedRow[];

export function mapSeoArticleToBlogMock(article: SeoArticleSeedRow, index: number) {
  return {
    id: `seo-71a-${index + 1}`,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: parseContentBlocks(article.content).flatMap((b) => {
      if (b.type === "paragraph") return [b.text];
      if (b.type === "heading") return [b.text];
      return [];
    }),
    category: article.category as BlogCategory,
    categoryLabel: article.category_label,
    author: article.author,
    authorRole: article.author_role,
    readTime: article.read_time,
    publishedAt: article.published_at,
    featured: article.featured,
    isPremium: article.is_premium,
    coverImageUrl: article.cover_image_url,
    seoTitle: article.seo_title,
    seoDescription: article.seo_description,
    seoKeywords: article.seo_keywords,
    ogImageUrl: article.og_image_url,
    status: "published" as const,
    contentBlocks: parseContentBlocks(article.content),
  };
}
