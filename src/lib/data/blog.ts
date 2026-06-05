import { parseContentBlocks } from "@/lib/admin/cms/content-blocks";
import { BLOG_CATEGORY_OPTIONS } from "@/lib/content-engine/constants";
import { CONTENT_ENGINE_ARTICLES } from "@/lib/content-engine/seed/articles";
import { withBase } from "./base";
import type { BlogArticle, BlogCategory } from "./types";

export const blogCategories = [
  { id: "todos", label: "Todos" },
  ...BLOG_CATEGORY_OPTIONS.map((c) => ({ id: c.id, label: c.label })),
] as const;

const rawArticles: Omit<
  BlogArticle,
  "status" | "createdAt" | "updatedAt" | "contentBlocks"
>[] = CONTENT_ENGINE_ARTICLES.map((article, index) => ({
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

export const blogArticles: BlogArticle[] = rawArticles.map((a) => ({
  ...withBase(a),
  contentBlocks: parseContentBlocks(a.content),
}));
export const featuredArticle = blogArticles.find((a) => a.featured)!;

export function isBlogCategory(id: string): id is BlogCategory | "todos" {
  return blogCategories.some((c) => c.id === id);
}
