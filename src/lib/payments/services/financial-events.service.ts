import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type FinancialEventType =
  | "checkout_started"
  | "payment_pending"
  | "payment_approved"
  | "payment_rejected"
  | "subscription_activated"
  | "subscription_renewed"
  | "subscription_canceled"
  | "subscription_expired"
  | "preapproval_authorized";

export interface FinancialEvent {
  id: string;
  userId: string;
  paymentId: string | null;
  subscriptionId: string | null;
  eventType: FinancialEventType;
  title: string;
  description: string | null;
  amountCents: number | null;
  currency: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface RecordFinancialEventInput {
  userId: string;
  paymentId?: string | null;
  subscriptionId?: string | null;
  eventType: FinancialEventType;
  title: string;
  description?: string;
  amountCents?: number | null;
  currency?: string;
  metadata?: Record<string, unknown>;
}

function mapRow(row: {
  id: string;
  user_id: string;
  payment_id: string | null;
  subscription_id: string | null;
  event_type: string;
  title: string;
  description: string | null;
  amount_cents: number | null;
  currency: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}): FinancialEvent {
  return {
    id: row.id,
    userId: row.user_id,
    paymentId: row.payment_id,
    subscriptionId: row.subscription_id,
    eventType: row.event_type as FinancialEventType,
    title: row.title,
    description: row.description,
    amountCents: row.amount_cents,
    currency: row.currency,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
  };
}

export async function recordFinancialEvent(
  admin: SupabaseClient<Database>,
  input: RecordFinancialEventInput,
): Promise<void> {
  const { error } = await admin.from("financial_events").insert({
    user_id: input.userId,
    payment_id: input.paymentId ?? null,
    subscription_id: input.subscriptionId ?? null,
    event_type: input.eventType,
    title: input.title,
    description: input.description ?? null,
    amount_cents: input.amountCents ?? null,
    currency: input.currency ?? "BRL",
    metadata: input.metadata ?? {},
  });

  if (error && process.env.NODE_ENV === "development") {
    console.error("[financial-events:record]", error);
  }
}

export async function fetchUserFinancialEvents(
  userId: string,
  limit = 50,
): Promise<FinancialEvent[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("financial_events")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[financial-events:fetch]", error.message);
    }
    return [];
  }

  return (data ?? []).map(mapRow);
}
