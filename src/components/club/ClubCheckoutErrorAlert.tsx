import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

interface ClubCheckoutErrorAlertProps {
  tone?: "default" | "onDark";
  className?: string;
}

export function ClubCheckoutErrorAlert({
  tone = "default",
  className,
}: ClubCheckoutErrorAlertProps) {
  const onDark = tone === "onDark";

  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border px-4 py-4 text-center sm:px-6",
        onDark
          ? "border-off-white/20 bg-off-white/10 text-off-white"
          : "border-red-200 bg-red-50 text-red-900",
        className,
      )}
    >
      <p className="text-sm font-medium">
        Você já possui uma assinatura Premium ativa.
      </p>
      <p className={cn("mt-1 text-sm", onDark ? "text-off-white/80" : "text-red-800")}>
        Acesse Minha Assinatura para gerenciar seu plano.
      </p>
      <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
        <Button
          href={routes.minhaAssinatura}
          variant={onDark ? "gold" : "primary"}
          size="md"
          className="w-full sm:w-auto"
        >
          Minha Assinatura
        </Button>
        <Button
          href={routes.minhaAssinatura}
          variant="outline"
          size="md"
          className={cn(
            "w-full sm:w-auto",
            onDark && "border-off-white/30 text-off-white hover:bg-off-white/10",
          )}
        >
          Gerenciar Plano
        </Button>
      </div>
    </div>
  );
}
