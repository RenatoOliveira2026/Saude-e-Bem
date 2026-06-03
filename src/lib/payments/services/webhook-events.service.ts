import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export async function registerWebhookEvent(
  admin: SupabaseClient<Database>,
  input: {
    eventKey: string;
    topic: string;
    resourceId?: string | null;
    payload: Record<string, unknown>;
    resultMessage: string;
  },
): Promise<boolean> {
  const { error } = await admin.from("payment_webhook_events").insert({
    provider: "mercadopago",
    event_key: input.eventKey,
    topic: input.topic,
    resource_id: input.resourceId ?? null,
    payload: input.payload,
    result_message: input.resultMessage,
  });

  if (error?.code === "23505") {
    return false;
  }

  if (error) throw error;
  return true;
}
