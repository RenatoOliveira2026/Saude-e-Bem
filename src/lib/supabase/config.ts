const PLACEHOLDER_URL_PATTERNS = [
  "your-project",
  "SEU-PROJECT",
  "seu-project-id",
] as const;

const PLACEHOLDER_KEY_PATTERNS = [
  "your-anon",
  "COLE-SUA-ANON",
  "COLE-SUA-ANON-KEY",
] as const;

export function isPlaceholderUrl(url?: string): boolean {
  if (!url) return true;
  return PLACEHOLDER_URL_PATTERNS.some((pattern) =>
    url.toLowerCase().includes(pattern.toLowerCase()),
  );
}

export function isPlaceholderKey(key?: string): boolean {
  if (!key) return true;
  return PLACEHOLDER_KEY_PATTERNS.some((pattern) =>
    key.includes(pattern),
  );
}

/**
 * Normaliza a Project URL do Supabase.
 * Usuários frequentemente colam a URL da REST API (/rest/v1/) por engano.
 */
export function normalizeSupabaseUrl(rawUrl: string): string {
  let url = rawUrl.trim();

  url = url.replace(/\/rest\/v1\/?$/i, "");
  url = url.replace(/\/auth\/v1\/?$/i, "");
  url = url.replace(/\/+$/, "");

  return url;
}

function ensureDevTlsForSupabase(): void {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.SUPABASE_STRICT_TLS !== "1" &&
    process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0"
  ) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    url &&
      key &&
      !isPlaceholderUrl(url) &&
      !isPlaceholderKey(key),
  );
}

export function getSupabaseEnv() {
  ensureDevTlsForSupabase();

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!rawUrl || !anonKey) {
    throw new Error(
      "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local",
    );
  }

  if (isPlaceholderUrl(rawUrl)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL ainda é placeholder. Use a Project URL do Dashboard (sem /rest/v1/).",
    );
  }

  if (isPlaceholderKey(anonKey)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY ainda é placeholder. Cole a chave anon public do Dashboard.",
    );
  }

  const url = normalizeSupabaseUrl(rawUrl);

  if (rawUrl !== url) {
    console.warn(
      `[Supabase] URL normalizada de "${rawUrl}" para "${url}". Use apenas a Project URL base.`,
    );
  }

  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) {
    console.warn(
      `[Supabase] Formato de URL inesperado: "${url}". Esperado: https://SEU-PROJECT-ID.supabase.co`,
    );
  }

  return { url, anonKey };
}

export type SupabaseConfigLog = {
  supabaseUrlExists: boolean;
  supabaseUrlIsPlaceholder: boolean;
  anonKeyExists: boolean;
  anonKeyIsPlaceholder: boolean;
  urlNormalized: string | null;
  urlHasRestSuffix: boolean;
  tlsRelaxedInDev: boolean;
};

export function getSupabaseConfigLog(): SupabaseConfigLog {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let urlNormalized: string | null = null;
  if (rawUrl && !isPlaceholderUrl(rawUrl)) {
    try {
      urlNormalized = normalizeSupabaseUrl(rawUrl);
    } catch {
      urlNormalized = null;
    }
  }

  return {
    supabaseUrlExists: Boolean(rawUrl?.trim()),
    supabaseUrlIsPlaceholder: isPlaceholderUrl(rawUrl),
    anonKeyExists: Boolean(key?.trim()),
    anonKeyIsPlaceholder: isPlaceholderKey(key),
    urlNormalized,
    urlHasRestSuffix: rawUrl?.includes("/rest/v1") ?? false,
    tlsRelaxedInDev:
      process.env.NODE_ENV === "development" &&
      process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0",
  };
}

/** Logs seguros para diagnóstico — nunca exibe a chave completa */
export function logSupabaseConfig(context: string): void {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const log = getSupabaseConfigLog();

  console.log(`[Supabase:${context}]`, {
    ...log,
    envFileExpected: ".env.local na raiz do projeto",
    keyPrefix: key ? `${key.slice(0, 12)}...` : null,
    keyLength: key?.length ?? 0,
  });
}

function getCauseChain(error: unknown): Array<{ name?: string; message?: string; code?: string }> {
  const chain: Array<{ name?: string; message?: string; code?: string }> = [];
  let current: unknown = error;

  while (current instanceof Error) {
    const cause = current.cause as { code?: string; message?: string } | undefined;
    chain.push({
      name: current.name,
      message: current.message,
      code: cause?.code,
    });
    current = current.cause;
  }

  return chain;
}

/** Erro técnico completo no terminal (server actions) */
export function logAuthTechnicalError(context: string, error: unknown): void {
  if (!(error instanceof Error)) {
    console.error(`[Supabase Auth:${context}] technical`, { error });
    return;
  }

  const cause = error.cause as { code?: string; message?: string; hostname?: string } | undefined;

  console.error(`[Supabase Auth:${context}] technical`, {
    name: error.name,
    message: error.message,
    causeCode: cause?.code ?? null,
    causeMessage: cause?.message ?? null,
    hostname: cause?.hostname ?? null,
    causeChain: getCauseChain(error),
    nodeTlsRejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED ?? "(unset)",
    config: getSupabaseConfigLog(),
  });
}

export function formatAuthFetchError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Erro desconhecido ao conectar com o Supabase.";
  }

  const chain = getCauseChain(error);
  const causeCode = chain.find((c) => c.code)?.code;

  if (causeCode === "ENOTFOUND") {
    const hostname = (error.cause as { hostname?: string })?.hostname;
    return `Não foi possível resolver o host Supabase (${hostname ?? "desconhecido"}). Verifique NEXT_PUBLIC_SUPABASE_URL no .env.local e reinicie o servidor.`;
  }

  if (causeCode === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
    return "Falha de certificado TLS ao conectar ao Supabase. Reinicie com npm run dev e confira o terminal por [with-env] ou [instrumentation].";
  }

  if (error.message.includes("fetch failed")) {
    return `Falha de rede ao Supabase (${causeCode ?? "sem código"}). Reinicie npm run dev após salvar .env.local.`;
  }

  return error.message;
}
