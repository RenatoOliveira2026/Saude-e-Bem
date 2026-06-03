import { createClient } from "@/lib/supabase/server";
import type { UserSavedProtocolRow } from "@/lib/supabase/types";
import type { SavedProtocol, SavedProtocolStatus } from "../types";

function mapRow(row: UserSavedProtocolRow): SavedProtocol {
  return {
    id: row.id,
    userId: row.user_id,
    protocolId: row.protocol_id,
    status: row.status,
    notes: row.notes,
    savedAt: row.saved_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchUserSavedProtocols(
  userId: string,
): Promise<SavedProtocol[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_saved_protocols")
    .select(
      "id, user_id, protocol_id, status, notes, saved_at, updated_at",
    )
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function isProtocolSaved(
  userId: string,
  protocolId: string,
): Promise<SavedProtocol | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_saved_protocols")
    .select(
      "id, user_id, protocol_id, status, notes, saved_at, updated_at",
    )
    .eq("user_id", userId)
    .eq("protocol_id", protocolId)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function saveUserProtocol(input: {
  userId: string;
  protocolId: string;
  status?: SavedProtocolStatus;
}): Promise<SavedProtocol> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_saved_protocols")
    .upsert(
      {
        user_id: input.userId,
        protocol_id: input.protocolId,
        status: input.status ?? "saved",
      },
      { onConflict: "user_id,protocol_id" },
    )
    .select(
      "id, user_id, protocol_id, status, notes, saved_at, updated_at",
    )
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function updateSavedProtocolStatus(input: {
  userId: string;
  protocolId: string;
  status: SavedProtocolStatus;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("user_saved_protocols")
    .update({ status: input.status })
    .eq("user_id", input.userId)
    .eq("protocol_id", input.protocolId);

  if (error) throw error;
}

export async function removeSavedProtocol(
  userId: string,
  protocolId: string,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("user_saved_protocols")
    .delete()
    .eq("user_id", userId)
    .eq("protocol_id", protocolId);

  if (error) throw error;
}

export async function countSavedProtocolsByStatus(
  userId: string,
): Promise<{ total: number; completed: number }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_saved_protocols")
    .select("status")
    .eq("user_id", userId);

  if (error) throw error;
  const rows = data ?? [];
  return {
    total: rows.length,
    completed: rows.filter((r) => r.status === "completed").length,
  };
}
