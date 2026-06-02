import { affiliateRowToDb, mapAffiliateRow } from "@/lib/affiliates/mappers";
import type { AffiliateLinkInput, AffiliateLinkRecord } from "@/lib/affiliates/types";
import { createClient } from "@/lib/supabase/server";

export type { AffiliateLinkRecord as AffiliateLink, AffiliateLinkInput };

export async function adminListAffiliateLinks(): Promise<AffiliateLinkRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("affiliate_links")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapAffiliateRow);
}

export async function adminGetAffiliateLink(
  id: string,
): Promise<AffiliateLinkRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("affiliate_links")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapAffiliateRow(data) : null;
}

export async function adminInsertAffiliateLink(
  input: AffiliateLinkInput,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("affiliate_links")
    .insert(affiliateRowToDb(input))
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function adminUpdateAffiliateLink(
  id: string,
  input: Partial<AffiliateLinkInput>,
): Promise<void> {
  const supabase = await createClient();
  const existing = await adminGetAffiliateLink(id);
  if (!existing) throw new Error("Afiliado não encontrado.");

  const merged: AffiliateLinkInput = {
    ...existing,
    ...input,
    title: input.title ?? existing.title,
    slug: input.slug ?? existing.slug,
    category: input.category ?? existing.category,
  };

  const { error } = await supabase
    .from("affiliate_links")
    .update(affiliateRowToDb(merged))
    .eq("id", id);

  if (error) throw error;
}

export async function adminDeleteAffiliateLink(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("affiliate_links").delete().eq("id", id);
  if (error) throw error;
}

export async function getAffiliateAdminCounts(): Promise<{
  total: number;
  active: number;
  featured: number;
}> {
  const supabase = await createClient();
  const [total, active, featured] = await Promise.all([
    supabase.from("affiliate_links").select("id", { count: "exact", head: true }),
    supabase
      .from("affiliate_links")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
    supabase
      .from("affiliate_links")
      .select("id", { count: "exact", head: true })
      .eq("active", true)
      .eq("featured", true),
  ]);

  return {
    total: total.count ?? 0,
    active: active.count ?? 0,
    featured: featured.count ?? 0,
  };
}
