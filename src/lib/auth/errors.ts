export type AuthErrorCode =
  | "email_exists"
  | "email_not_confirmed"
  | "invalid_credentials"
  | "user_not_found"
  | "weak_password"
  | "invalid_email"
  | "network"
  | "unknown";

export type TranslatedAuthError = {
  message: string;
  code: AuthErrorCode;
};

type AuthErrorLike = {
  message?: string;
  code?: string;
  status?: number;
};

export function translateAuthError(error: AuthErrorLike | string): TranslatedAuthError {
  const message = (typeof error === "string" ? error : error.message ?? "").trim();
  const code = typeof error === "string" ? undefined : error.code;
  const lower = message.toLowerCase();

  if (
    code === "user_already_exists" ||
    code === "email_exists" ||
    lower.includes("user already registered") ||
    lower.includes("already been registered")
  ) {
    return {
      code: "email_exists",
      message:
        "Este e-mail já está cadastrado. Faça login ou use “Esqueceu a senha?” para redefinir sua senha.",
    };
  }

  if (code === "email_not_confirmed" || lower.includes("email not confirmed")) {
    return {
      code: "email_not_confirmed",
      message:
        "E-mail ainda não confirmado. Abra o link que enviamos na sua caixa de entrada (ou spam) e tente entrar novamente.",
    };
  }

  if (code === "invalid_credentials" || lower.includes("invalid login credentials")) {
    return {
      code: "invalid_credentials",
      message: "E-mail ou senha incorretos.",
    };
  }

  if (
    code === "user_not_found" ||
    lower.includes("user not found") ||
    lower.includes("no user found")
  ) {
    return {
      code: "user_not_found",
      message: "Não encontramos uma conta com este e-mail. Cadastre-se ou verifique o endereço digitado.",
    };
  }

  if (code === "weak_password" || lower.includes("password should be at least")) {
    return {
      code: "weak_password",
      message: "A senha deve ter pelo menos 8 caracteres.",
    };
  }

  if (
    lower.includes("unable to validate email") ||
    lower.includes("invalid email") ||
    code === "validation_failed"
  ) {
    return {
      code: "invalid_email",
      message: "E-mail inválido. Verifique o endereço e tente novamente.",
    };
  }

  if (
    lower.includes("falha de certificado tls") ||
    lower.includes("unable to verify") ||
    lower.includes("leaf_signature")
  ) {
    return {
      code: "network",
      message,
    };
  }

  if (
    lower.includes("falha de rede ao supabase") ||
    lower.includes("falha de conexão com o supabase") ||
    lower.includes("não foi possível resolver o host")
  ) {
    return {
      code: "network",
      message,
    };
  }

  if (lower === "fetch failed") {
    return {
      code: "network",
      message:
        "Não foi possível conectar ao servidor de autenticação. Reinicie npm run dev e verifique .env.local (URL e chave anon).",
    };
  }

  return {
    code: "unknown",
    message: message || "Não foi possível concluir a operação. Tente novamente.",
  };
}
