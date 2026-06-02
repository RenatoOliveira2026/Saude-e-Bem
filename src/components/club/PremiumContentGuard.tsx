import { PremiumGate } from "@/components/layout/DetailPage";
import {
  getPremiumUpgradeHref,
  resolvePremiumAccess,
} from "@/lib/club/access";
import type { ReactNode } from "react";

interface PremiumContentGuardProps {
  isPremiumContent: boolean;
  gateTitle: string;
  gateDescription: string;
  children: ReactNode;
}

/** Exibe gate ou conteúdo completo conforme assinatura premium. */
export async function PremiumContentGuard({
  isPremiumContent,
  gateTitle,
  gateDescription,
  children,
}: PremiumContentGuardProps) {
  if (!isPremiumContent) {
    return <>{children}</>;
  }

  const access = await resolvePremiumAccess(true);
  if (access.canAccess) {
    return <>{children}</>;
  }

  return (
    <PremiumGate
      title={gateTitle}
      description={gateDescription}
      upgradeHref={getPremiumUpgradeHref(access.isLoggedIn)}
      ctaLabel={
        access.isLoggedIn ? "Assinar Premium" : "Entrar e conhecer o Premium"
      }
    />
  );
}
