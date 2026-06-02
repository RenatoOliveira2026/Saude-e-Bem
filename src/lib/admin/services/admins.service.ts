import { createClient } from "@/lib/supabase/server";
import type { AdminTeamMember } from "../types";

export async function adminListTeamMembers(): Promise<AdminTeamMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, user_id, email, role, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[admin] adminListTeamMembers:", error.message);
    return [];
  }

  return (data ?? []) as AdminTeamMember[];
}
