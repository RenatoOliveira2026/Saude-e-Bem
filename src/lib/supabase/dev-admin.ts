import { createClient } from "@supabase/supabase-js";
import { isDevLoginAllowed } from "@/lib/auth/dev-login";
import { getSupabaseEnv } from "./config";
import type { Database } from "./types";

/** Cliente service role — somente ações de dev-login em ambiente local */
export function createDevAdminClient() {
  if (!isDevLoginAllowed()) {
    throw new Error("Dev admin client não disponível fora do ambiente local.");
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceRoleKey) {
    return null;
  }

  const { url } = getSupabaseEnv();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
