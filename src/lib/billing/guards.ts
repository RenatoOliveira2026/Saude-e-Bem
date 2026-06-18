import { routes } from "@/lib/routes";
import type { BillingProfileFields } from "./profile";
import { isBillingProfileComplete } from "./profile";

export const BILLING_PROFILE_INCOMPLETE_CODE = "profile_incomplete";

export class BillingProfileIncompleteError extends Error {
  readonly code = BILLING_PROFILE_INCOMPLETE_CODE;

  constructor() {
    super(
      "Complete seu cadastro com CPF e endereço antes de assinar.",
    );
    this.name = "BillingProfileIncompleteError";
  }
}

export function assertBillingProfileComplete(
  profile: BillingProfileFields | null | undefined,
): void {
  if (!isBillingProfileComplete(profile)) {
    throw new BillingProfileIncompleteError();
  }
}

export function billingProfileRedirectUrl(returnPath: string = routes.assinar): string {
  return `${routes.completarCadastro}?next=${encodeURIComponent(returnPath)}`;
}

/** Lê `next` ou `redirect` (legado) da query string. */
export function resolveBillingReturnPath(
  next: string | null | undefined,
  redirect: string | null | undefined,
  fallback: string = routes.minhaAssinatura,
): string {
  const candidate = next ?? redirect;
  if (candidate?.startsWith("/") && !candidate.startsWith("//")) {
    return candidate;
  }
  return fallback;
}

export function isBillingProfileIncompleteError(error: unknown): boolean {
  return (
    error instanceof BillingProfileIncompleteError ||
    (error instanceof Error && error.message.includes("cadastro"))
  );
}
