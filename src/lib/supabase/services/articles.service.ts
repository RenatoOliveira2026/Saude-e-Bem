import { createClient } from "@/lib/supabase/server";
import { mapArticleRow } from "@/lib/supabase/mappers/content";
import type { BlogArticle } from "@/lib/data/types";

/**
 * T-05 / S-04: listagens leem o catálogo público (`articles_public`), que traz
 * todas as linhas publicadas com o corpo vazio nas premium. O corpo completo
 * de uma linha premium só vem da tabela, cuja política libera premium e admin.
 */
const CATALOG = "articles_public" as const;

const ARTICLE_COLUMNS =
  "id, slug, title, excerpt, content, cover_image_url, category, category_label, author, author_role, read_time, published_at, featured, is_premium, seo_title, seo_description, seo_keywords, og_image_url, status, created_at, updated_at";

export async function fetchArticlesFromSupabase(): Promise<BlogArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CATALOG)
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapArticleRow);
}

export async function fetchArticleBySlugFromSupabase(
  slug: string,
): Promise<BlogArticle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CATALOG)
    .select(ARTICLE_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  if (data.is_premium) {
    const { data: full, error: fullError } = await supabase
      .from("articles")
      .select(ARTICLE_COLUMNS)
      .eq("id", data.id)
      .maybeSingle();
    if (fullError) throw fullError;
    if (full) return mapArticleRow(full);
  }

  return mapArticleRow(data);
}

export async function fetchFeaturedArticleFromSupabase(): Promise<BlogArticle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CATALOG)
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .eq("featured", true)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (data) return mapArticleRow(data);

  const { data: fallback, error: fallbackError } = await supabase
    .from(CATALOG)
    .select(ARTICLE_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fallbackError) throw fallbackError;
  return fallback ? mapArticleRow(fallback) : null;
}

export async function fetchArticleSlugsFromSupabase(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(CATALOG)
    .select("slug")
    .eq("status", "published");

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}
