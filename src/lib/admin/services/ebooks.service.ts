import { createClient } from "@/lib/supabase/server";
import { mapEbookRow } from "@/lib/supabase/mappers/content";
import type { LibraryResource } from "@/lib/data/types";
import type { EbookRow } from "@/lib/supabase/types";

const COLUMNS =
  "id, slug, title, description, long_description, content, category, category_label, icon, format, pages, highlights, is_premium, downloads, featured, cover_image_url, pdf_url, seo_title, seo_description, seo_keywords, og_image_url, status, created_at, updated_at";

export async function adminListEbooks(): Promise<LibraryResource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ebooks")
    .select(COLUMNS)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapEbookRow);
}

export async function adminGetEbook(id: string): Promise<LibraryResource | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ebooks")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapEbookRow(data) : null;
}

export async function adminDeleteEbook(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("ebooks").delete().eq("id", id);
  if (error) throw error;
}

export type EbookAdminInput = Omit<EbookRow, "id" | "created_at" | "updated_at">;

export async function adminInsertEbook(input: EbookAdminInput): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ebooks")
    .insert(input)
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function adminUpdateEbook(
  id: string,
  input: Partial<EbookAdminInput>,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("ebooks").update(input).eq("id", id);
  if (error) throw error;
}
