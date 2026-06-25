import { routes } from "@/lib/routes";

const ALLOWED_PREFIXES = [
  routes.assinar,
  routes.completarCadastro,
  routes.minhaAssinatura,
  routes.minhaJornada,
  routes.clube,
] as const;

/** Caminhos internos seguros após confirmação de e-mail ou cadastro (Fase 9.3). */
export function safePostAuthRedirect(
  path: string | null | undefined,
  fallback: string = routes.minhaJornada,
): string {
  if (!path?.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }

  const isAllowed = ALLOWED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}?`),
  );

  return isAllowed ? path : fallback;
}

export function isSubscriptionIntent(path: string): boolean {
  return path.startsWith(routes.assinar) || path.startsWith(routes.completarCadastro);
}
