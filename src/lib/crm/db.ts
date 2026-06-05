import { createClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/** Service role para writes; fallback admin RLS para reads. */
export async function getCrmDbClient() {
  return getServiceRoleClient() ?? (await createClient());
}
