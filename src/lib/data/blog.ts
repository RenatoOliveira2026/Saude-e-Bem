import { parseContentBlocks } from "@/lib/admin/cms/content-blocks";
import { BLOG_CATEGORY_OPTIONS } from "@/lib/content-engine/constants";
import { CONTENT_ENGINE_ARTICLES } from "@/lib/content-engine/seed/articles";
import {
  mapSeoArticleToBlogMock,
  SEO_ARTICLES_71A,
} from "@/lib/content-engine/seed/seo-articles-71a";
import { withBase } from "./base";
import type { BlogArticle, BlogCategory } from "./types";

export const blogCategories = [
  { id: "todos", label: "Todos" },
  ...BLOG_CATEGORY_OPTIONS.map((c) => ({ id: c.id, label: c.label })),
] as const;

const engineArticles = CONTENT_ENGINE_ARTICLES.map((article, index) => ({
  id: String(index + 1),
  slug: article.slug,
  title: article.title,
  excerpt: article.excerpt,
  content: [...article.content],
  category: article.category as BlogCategory,
  categoryLabel: article.category_label,
  author: article.author,
  authorRole: article.author_role,
  readTime: article.read_time,
  publishedAt: article.published_at,
  featured: article.featured,
  isPremium: article.is_premium,
  coverImageUrl: (article as { cover_image_url?: string }).cover_image_url,
  seoTitle: article.seo_title,
  seoDescription: article.seo_description,
  seoKeywords: article.seo_keywords,
  ogImageUrl: article.og_image_url,
}));

const seoArticles = SEO_ARTICLES_71A.map((article, index) => {
  const mapped = mapSeoArticleToBlogMock(article, index);
  const { contentBlocks, ...rest } = mapped;
  void contentBlocks;
  return rest;
});

const rawArticles: Omit<
  BlogArticle,
  "status" | "createdAt" | "updatedAt" | "contentBlocks"
>[] = [...engineArticles, ...seoArticles];

export const blogArticles: BlogArticle[] = rawArticles.map((a, index) => {
  const contentBlocks =
    index >= engineArticles.length
      ? mapSeoArticleToBlogMock(
          SEO_ARTICLES_71A[index - engineArticles.length],
          index - engineArticles.length,
        ).contentBlocks
      : parseContentBlocks(a.content);

  return {
    ...withBase(a),
    contentBlocks,
  };
});

export const featuredArticle =
  blogArticles.find((a) => a.featured) ?? blogArticles[0] ?? null;

export function isBlogCategory(id: string): id is BlogCategory | "todos" {
  return blogCategories.some((c) => c.id === id);
}
