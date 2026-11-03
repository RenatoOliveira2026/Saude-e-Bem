"use server";

import { isAdminUser } from "@/lib/admin/session";
import { getCurrentUser } from "@/lib/auth/session";
import { isStubModeEnabled } from "@/lib/payments/config";
import { simulatePaymentApproval } from "@/lib/payments/mercadopago/webhook";
import { getPaymentByReference } from "@/lib/payments/services/payments.service";

/**
 * Aprova um pagamento em modo stub (apenas desenvolvimento).
 *
 * T-04 / S-03: recusa sempre fora do stub (o stub já exige
 * NODE_ENV !== "production") e só aceita o dono do pagamento ou um admin.
 */
export async function simulatePaymentApprovalAction(
  externalReference: string,
): Promise<{ ok: boolean; message: string }> {
  if (!isStubModeEnabled()) {
    return { ok: false, message: "Simulação indisponível neste ambiente." };
  }

  const reference = typeof externalReference === "string" ? externalReference.trim() : "";
  if (!reference) {
    return { ok: false, message: "Referência inválida." };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, message: "Entre na sua conta para continuar." };
  }

  const payment = await getPaymentByReference(reference);
  if (!payment) {
    return { ok: false, message: "Pagamento não encontrado." };
  }

  const isOwner = payment.userId === user.id;
  if (!isOwner && !(await isAdminUser(user.email ?? "", user.id))) {
    return { ok: false, message: "Pagamento não encontrado." };
  }

  return simulatePaymentApproval(reference);
}
