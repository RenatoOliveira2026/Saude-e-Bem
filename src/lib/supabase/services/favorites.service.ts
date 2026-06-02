import { createClient } from "@/lib/supabase/server";
import type {
  Favorite,
  FavoriteContentType,
  FavoriteInput,
} from "@/lib/favorites/types";
import type { FavoriteRow } from "@/lib/supabase/types";

function mapFavoriteRow(row: FavoriteRow): Favorite {
  return {
    id: row.id,
    userId: row.user_id,
    contentType: row.content_type as FavoriteContentType,
    contentId: row.content_id,
    createdAt: row.created_at,
  };
}

/** Lista favoritos do usuário autenticado (leitura). */
export async function fetchUserFavorites(
  userId: string,
): Promise<Favorite[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("id, user_id, content_type, content_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapFavoriteRow);
}

/** Verifica se um item está nos favoritos do usuário. */
export async function isFavorite(
  userId: string,
  contentType: FavoriteContentType,
  contentId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

/** IDs favoritados por tipo — útil para badges em listagens. */
export async function fetchFavoriteIdsByType(
  userId: string,
  contentType: FavoriteContentType,
): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("content_id")
    .eq("user_id", userId)
    .eq("content_type", contentType);

  if (error) throw error;
  return (data ?? []).map((row) => row.content_id);
}

/**
 * Adiciona favorito — preparado para UI futura (requer usuário autenticado).
 * Não exposto na interface pública ainda.
 */
export async function addFavorite(
  userId: string,
  input: FavoriteInput,
): Promise<Favorite | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favorites")
    .insert({
      user_id: userId,
      content_type: input.contentType,
      content_id: input.contentId,
    })
    .select("id, user_id, content_type, content_id, created_at")
    .maybeSingle();

  if (error) throw error;
  return data ? mapFavoriteRow(data) : null;
}

/**
 * Remove favorito — preparado para UI futura.
 */
export async function removeFavorite(
  userId: string,
  input: FavoriteInput,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("content_type", input.contentType)
    .eq("content_id", input.contentId);

  if (error) throw error;
}
