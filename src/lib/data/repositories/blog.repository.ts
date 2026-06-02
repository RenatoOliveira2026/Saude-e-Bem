import { blogArticles, featuredArticle } from "../blog";
import type { BlogArticle, BlogCategory } from "../types";
import {
  fetchArticleBySlugFromSupabase,
  fetchArticleSlugsFromSupabase,
  fetchArticlesFromSupabase,
  fetchFeaturedArticleFromSupabase,
} from "@/lib/supabase/services/articles.service";
import {
  withSupabaseListFallback,
  withSupabaseNullableFallback,
} from "@/lib/supabase/services/fallback";

const LABEL = "blog.repository";

function publishedMocks(): BlogArticle[] {
  return blogArticles.filter((a) => a.status === "published");
}

export async function getBlogArticles(): Promise<BlogArticle[]> {
  return withSupabaseListFallback(
    fetchArticlesFromSupabase,
    publishedMocks,
    LABEL,
  );
}

export async function getBlogArticleBySlug(
  slug: string,
): Promise<BlogArticle | null> {
  return withSupabaseNullableFallback(
    () => fetchArticleBySlugFromSupabase(slug),
    () =>
      blogArticles.find((a) => a.slug === slug && a.status === "published") ??
      null,
    LABEL,
  );
}

export async function getFeaturedBlogArticle(): Promise<BlogArticle | null> {
  return withSupabaseNullableFallback(
    fetchFeaturedArticleFromSupabase,
    () => featuredArticle ?? publishedMocks()[0] ?? null,
    LABEL,
  );
}

export async function getBlogArticlesByCategory(
  category: BlogCategory | "todos",
): Promise<BlogArticle[]> {
  const all = await getBlogArticles();
  if (category === "todos") return all;
  return all.filter((a) => a.category === category);
}

export async function getBlogSlugs(): Promise<string[]> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const slugs = await fetchArticleSlugsFromSupabase();
      if (slugs.length > 0) return slugs;
    } catch {
      // fallback abaixo
    }
  }
  return blogArticles.map((a) => a.slug);
}

export { blogArticles, featuredArticle };
