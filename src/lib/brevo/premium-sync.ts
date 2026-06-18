import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getBrevoPremiumListId,
  isBrevoLiveSyncEnabled,
  upsertBrevoContact,
} from "@/lib/brevo";
import type { Database } from "@/lib/supabase/types";

async function resolveUserContact(
  admin: SupabaseClient<Database>,
  userId: string,
): Promise<{ email: string; name: string | null } | null> {
  const { data: profile } = await admin
    .from("profiles")
    .select("email, name")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.email) {
    return { email: profile.email, name: profile.name };
  }

  const { data: authUser } = await admin.auth.admin.getUserById(userId);
  const email = authUser.user?.email;
  if (!email) return null;

  return {
    email,
    name: (authUser.user?.user_metadata?.name as string | undefined) ?? null,
  };
}

/** Marca assinante Premium no Brevo (atributos + lista opcional). */
export async function syncPremiumSubscriberToBrevo(
  admin: SupabaseClient<Database>,
  input: {
    userId: string;
    planId: string;
    status: "active" | "canceled";
  },
): Promise<void> {
  if (!isBrevoLiveSyncEnabled()) return;

  const contact = await resolveUserContact(admin, input.userId);
  if (!contact) return;

  const premiumListId = getBrevoPremiumListId();
  const listIds = premiumListId ? [premiumListId] : undefined;

  try {
    await upsertBrevoContact({
      email: contact.email,
      attributes: {
        ...(contact.name ? { FIRSTNAME: contact.name } : {}),
        PREMIUM: input.status === "active",
        MEMBERSHIP_STATUS: input.status,
        PREMIUM_PLAN: input.planId,
      },
      ...(listIds ? { listIds } : {}),
    });
  } catch (error) {
    console.error("[brevo/premium-sync] Falha ao sincronizar assinante:", error);
  }
}
