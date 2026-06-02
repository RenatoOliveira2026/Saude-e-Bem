import { createClient } from "@/lib/supabase/server";
import { mapProtocolRow } from "@/lib/supabase/mappers/content";
import type { Protocol } from "@/lib/data/types";
import type { ProtocolRow } from "@/lib/supabase/types";

const COLUMNS =
  "id, slug, title, description, objective, long_description, content, category, category_label, duration, level, benefits, steps, is_premium, featured, tag, participants, cover_image_url, seo_title, seo_description, seo_keywords, og_image_url, status, created_at, updated_at";

export async function adminListProtocols(): Promise<Protocol[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("protocols")
    .select(COLUMNS)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapProtocolRow);
}

export async function adminGetProtocol(id: string): Promise<Protocol | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("protocols")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapProtocolRow(data) : null;
}

export async function adminDeleteProtocol(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("protocols").delete().eq("id", id);
  if (error) throw error;
}

export type ProtocolAdminInput = Omit<
  ProtocolRow,
  "id" | "created_at" | "updated_at"
>;

export async function adminInsertProtocol(
  input: ProtocolAdminInput,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("protocols")
    .insert(input)
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function adminUpdateProtocol(
  id: string,
  input: Partial<ProtocolAdminInput>,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("protocols").update(input).eq("id", id);
  if (error) throw error;
}
