import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { UserProfileData } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(routes.entrar);
  return user;
}

export async function getUserProfile(userId: string): Promise<UserProfileData> {
  const supabase = await createClient();

  const [profileResult, preferencesResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  return {
    profile: profileResult.data,
    preferences: preferencesResult.data,
  };
}

export async function getSessionProfile(): Promise<{
  user: User;
  profile: UserProfileData;
}> {
  const user = await requireUser();
  const profile = await getUserProfile(user.id);
  return { user, profile };
}
