/** Mensagens para erros repassados via query string nas rotas de auth. */
export const AUTH_URL_ERROR_MESSAGES: Record<string, string> = {
  recovery_link_invalid:
    "O link de recuperação expirou ou é inválido. Solicite um novo link abaixo.",
  auth_callback_failed:
    "Não foi possível confirmar seu acesso. O link pode ter expirado ou já foi usado. Tente entrar com sua senha ou solicite um novo e-mail de confirmação.",
  email_confirm_failed:
    "Não foi possível confirmar seu e-mail. Solicite um novo link em Cadastro ou entre se já confirmou anteriormente.",
};

export function getAuthUrlErrorMessage(code: string | null): string | null {
  if (!code) return null;
  return AUTH_URL_ERROR_MESSAGES[code] ?? null;
}
