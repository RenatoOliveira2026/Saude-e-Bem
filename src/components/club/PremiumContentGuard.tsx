import { PremiumGate } from "@/components/subscription/PremiumGate";
import {
  getPremiumUpgradeHref,
  resolvePremiumAccess,
} from "@/lib/club/access";
import { routes } from "@/lib/routes";
import type { ReactNode } from "react";

interface PremiumContentGuardProps {
  isPremiumContent: boolean;
  gateTitle: string;
  gateDescription: string;
  /** Trecho visível antes do bloqueio (preview). */
  preview?: ReactNode;
  children: ReactNode;
}

/** Exibe preview + gate ou conteúdo completo conforme assinatura premium. */
export async function PremiumContentGuard({
  isPremiumContent,
  gateTitle,
  gateDescription,
  preview,
  children,
}: PremiumContentGuardProps) {
  if (!isPremiumContent) {
    return <>{children}</>;
  }

  const access = await resolvePremiumAccess(true);
  if (access.canAccess) {
    return <>{children}</>;
  }

  const upgradeHref = getPremiumUpgradeHref(access.isLoggedIn);

  if (preview) {
    return (
      <>
        <div className="relative">
          <div className="max-h-96 overflow-hidden">{preview}</div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-surface to-transparent"
            aria-hidden="true"
          />
        </div>
        <PremiumGate
          title={gateTitle}
          description={gateDescription}
          upgradeHref={routes.clube}
          ctaLabel="Conhecer o Clube Saúde & Bem"
        />
      </>
    );
  }

  return (
    <PremiumGate
      title={gateTitle}
      description={gateDescription}
      upgradeHref={upgradeHref}
      ctaLabel={access.isLoggedIn ? "Assinar agora" : "Entrar e assinar"}
    />
  );
}
