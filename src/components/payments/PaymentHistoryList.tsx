import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  formatPaymentAmount,
  paymentMethodLabels,
  paymentStatusLabels,
} from "@/lib/payments/constants";
import { formatSubscriptionDate } from "@/lib/club/constants";
import type { Payment } from "@/lib/payments/types";

interface PaymentHistoryListProps {
  payments: Payment[];
}

export function PaymentHistoryList({ payments }: PaymentHistoryListProps) {
  if (payments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted">Nenhum pagamento registrado ainda.</p>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {payments.map((payment) => (
        <li key={payment.id}>
          <Card className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading font-semibold text-forest">
                  {payment.description ?? "Clube Premium"}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {formatPaymentAmount(payment.amountCents, payment.currency)}
                  {payment.paymentMethod &&
                    ` · ${paymentMethodLabels[payment.paymentMethod]}`}
                  {payment.billingPlanId && ` · ${payment.billingPlanId}`}
                </p>
                <p className="mt-1 text-xs text-muted-light">
                  {formatSubscriptionDate(payment.paidAt ?? payment.createdAt)}
                </p>
              </div>
              <Badge
                variant={
                  payment.status === "approved" ? "gold" : "default"
                }
              >
                {paymentStatusLabels[payment.status]}
              </Badge>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
