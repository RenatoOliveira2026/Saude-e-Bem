import { createClient } from "@/lib/supabase/server";
import { mapArticleRow } from "@/lib/supabase/mappers/content";
import type { BlogArticle } from "@/lib/data/types";
import type { ArticleRow } from "@/lib/supabase/types";

const COLUMNS =
  "id, slug, title, excerpt, content, category, category_label, author, author_role, read_time, published_at, featured, cover_image_url, seo_title, seo_description, seo_keywords, og_image_url, status, created_at, updated_at";

export async function adminListArticles(): Promise<BlogArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(COLUMNS)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapArticleRow);
}

export async function adminGetArticle(id: string): Promise<BlogArticle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapArticleRow(data) : null;
}

export async function adminDeleteArticle(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}

export type ArticleAdminInput = Omit<
  ArticleRow,
  "id" | "created_at" | "updated_at"
>;

export async function adminInsertArticle(
  input: ArticleAdminInput,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .insert(input)
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function adminUpdateArticle(
  id: string,
  input: Partial<ArticleAdminInput>,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("articles").update(input).eq("id", id);
  if (error) throw error;
}
