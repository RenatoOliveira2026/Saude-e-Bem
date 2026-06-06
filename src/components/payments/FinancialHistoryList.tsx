import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatPaymentAmount } from "@/lib/payments/constants";
import type { FinancialEvent } from "@/lib/payments/services/financial-events.service";
import { formatSubscriptionDate } from "@/lib/club/constants";

interface FinancialHistoryListProps {
  events: FinancialEvent[];
}

const EVENT_VARIANTS: Record<string, "gold" | "sage" | "default" | "forest"> = {
  checkout_started: "default",
  payment_pending: "default",
  payment_approved: "gold",
  payment_rejected: "default",
  subscription_activated: "forest",
  subscription_renewed: "sage",
  subscription_canceled: "default",
  subscription_expired: "default",
  preapproval_authorized: "sage",
};

export function FinancialHistoryList({ events }: FinancialHistoryListProps) {
  if (events.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted">Nenhum evento financeiro registrado ainda.</p>
      </Card>
    );
  }

  return (
    <ol className="space-y-3">
      {events.map((event) => (
        <li key={event.id}>
          <Card className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading font-semibold text-forest">{event.title}</p>
                {event.description && (
                  <p className="mt-1 text-sm text-muted">{event.description}</p>
                )}
                {event.amountCents != null && (
                  <p className="mt-1 text-sm text-muted">
                    {formatPaymentAmount(event.amountCents, event.currency)}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-light">
                  {formatSubscriptionDate(event.createdAt)}
                </p>
              </div>
              <Badge variant={EVENT_VARIANTS[event.eventType] ?? "default"}>
                {event.eventType.replace(/_/g, " ")}
              </Badge>
            </div>
          </Card>
        </li>
      ))}
    </ol>
  );
}
