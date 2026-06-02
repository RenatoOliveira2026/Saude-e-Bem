import { createClient } from "@/lib/supabase/server";
import type { AdminUserRow } from "../types";

export async function adminListUsers(): Promise<AdminUserRow[]> {
  const supabase = await createClient();

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, name, created_at")
    .order("created_at", { ascending: false });

  if (profilesError) throw profilesError;

  const { data: preferences, error: prefsError } = await supabase
    .from("user_preferences")
    .select("user_id, goal");

  if (prefsError) throw prefsError;

  const goalByUser = new Map(
    (preferences ?? []).map((p) => [p.user_id, p.goal]),
  );

  return (profiles ?? []).map((profile) => ({
    id: profile.id,
    email: profile.email,
    name: profile.name,
    goal: goalByUser.get(profile.id) ?? null,
    created_at: profile.created_at,
  }));
}
