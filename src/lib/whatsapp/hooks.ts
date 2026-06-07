import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { sendPremiumConfirmationWhatsApp } from "@/lib/whatsapp";
import type { Payment } from "@/lib/payments/types";
import type { BillingPlan } from "@/lib/payments/plans";

export async function notifyPremiumViaWhatsApp(
  admin: SupabaseClient<Database>,
  payment: Payment,
  plan: BillingPlan,
): Promise<void> {
  try {
    const { data: userData } = await admin.auth.admin.getUserById(payment.userId);
    const email = userData.user?.email;
    if (!email) return;

    await sendPremiumConfirmationWhatsApp({
      userId: payment.userId,
      email,
      planName: plan.name,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[whatsapp:premium-notify]", error);
    }
  }
}
