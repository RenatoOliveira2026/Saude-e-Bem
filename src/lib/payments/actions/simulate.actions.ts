"use server";

import { simulatePaymentApproval } from "@/lib/payments/mercadopago/webhook";

export async function simulatePaymentApprovalAction(
  externalReference: string,
): Promise<{ ok: boolean; message: string }> {
  if (!externalReference.trim()) {
    return { ok: false, message: "Referência inválida." };
  }
  return simulatePaymentApproval(externalReference);
}
