import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/types";

let cached: SupabaseClient<Database> | null = null;

/** Cliente service role — apenas server-side (CRM, automação, sync ESP). */
export function getServiceRoleClient(): SupabaseClient<Database> | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceKey) return null;

  if (cached) return cached;

  const { url } = getSupabaseEnv();
  cached = createSupabaseClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return cached;
}
