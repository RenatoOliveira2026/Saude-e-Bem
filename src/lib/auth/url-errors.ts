/** Mensagens para erros repassados via query string nas rotas de auth. */
export const AUTH_URL_ERROR_MESSAGES: Record<string, string> = {
  recovery_link_invalid:
    "O link de recuperação expirou ou é inválido. Solicite um novo link abaixo.",
  auth_callback_failed:
    "Não foi possível confirmar seu acesso. Tente entrar novamente ou solicite um novo link de recuperação.",
};

export function getAuthUrlErrorMessage(code: string | null): string | null {
  if (!code) return null;
  return AUTH_URL_ERROR_MESSAGES[code] ?? null;
}
