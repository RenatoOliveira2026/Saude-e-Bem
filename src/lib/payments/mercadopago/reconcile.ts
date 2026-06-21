import { createPaymentsAdminClient } from "../admin-client";
import { isMercadoPagoConfigured } from "../config";
import {
  searchMercadoPagoPaymentsByReference,
  type MercadoPagoPaymentRecord,
} from "./client";
import { syncPaymentByReference } from "./webhook";

export interface ReconcilePaymentResult {
  paymentId: string;
  externalReference: string;
  preferenceId: string | null;
  previousStatus: string;
  ok: boolean;
  message: string;
  mercadoPagoStatus?: string;
  mercadoPagoId?: string;
}

async function findApprovedMercadoPagoPayment(
  externalReference: string,
): Promise<MercadoPagoPaymentRecord | null> {
  const payments = await searchMercadoPagoPaymentsByReference(externalReference);
  return (
    payments.find((p) => p.status === "approved") ??
    payments.find((p) => p.status === "authorized") ??
    null
  );
}

/** Reconcilia pagamentos locais `pending` consultando o Mercado Pago. */
export async function reconcilePendingPayments(input?: {
  limit?: number;
  externalReference?: string;
  paymentId?: string;
}): Promise<ReconcilePaymentResult[]> {
  if (!isMercadoPagoConfigured()) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado.");
  }

  const admin = createPaymentsAdminClient();
  if (!admin) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurado.");
  }

  const limit = input?.limit ?? 25;

  let query = admin
    .from("payments")
    .select(
      "id, external_reference, preference_id, status, payment_method, created_at",
    )
    .eq("provider", "mercadopago")
    .in("status", ["pending", "in_process", "in_mediation"])
    .order("created_at", { ascending: false })
    .limit(limit);

  if (input?.externalReference) {
    query = query.eq("external_reference", input.externalReference);
  }
  if (input?.paymentId) {
    query = query.eq("id", input.paymentId);
  }

  const { data: rows, error } = await query;
  if (error) throw error;

  const results: ReconcilePaymentResult[] = [];

  for (const row of rows ?? []) {
    const externalReference = row.external_reference;
    const mpPayment = await findApprovedMercadoPagoPayment(externalReference);

    if (!mpPayment?.id) {
      results.push({
        paymentId: row.id,
        externalReference,
        preferenceId: row.preference_id,
        previousStatus: row.status,
        ok: false,
        message: "Nenhum pagamento aprovado no Mercado Pago para esta referência.",
        mercadoPagoStatus: "not_found_or_pending",
      });
      continue;
    }

    const sync = await syncPaymentByReference(externalReference);

    const { data: updated } = await admin
      .from("payments")
      .select("status, external_id")
      .eq("id", row.id)
      .maybeSingle();

    results.push({
      paymentId: row.id,
      externalReference,
      preferenceId: row.preference_id,
      previousStatus: row.status,
      ok: sync.ok,
      message: sync.message,
      mercadoPagoStatus: String(mpPayment.status ?? "unknown"),
      mercadoPagoId: String(mpPayment.id),
      ...(updated
        ? {
            message: sync.ok
              ? `${sync.message} (local: ${updated.status}, mp_id: ${updated.external_id ?? mpPayment.id})`
              : sync.message,
          }
        : {}),
    });
  }

  return results;
}
