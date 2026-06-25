import { safePostAuthRedirect } from "@/lib/auth/safe-redirect";
import type { EmailOtpType } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export const CONFIRM_OTP_TYPES = new Set<EmailOtpType>([
  "signup",
  "email",
  "invite",
  "magiclink",
  "email_change",
]);

export function safeAuthRedirectPath(
  path: string | null,
  fallback: string,
): string {
  return safePostAuthRedirect(path ?? undefined, fallback);
}

export function parseHashParams(hash: string): URLSearchParams {
  const trimmed = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(trimmed);
}

export async function completeAuthFromUrl(
  supabase: SupabaseClient,
  search: URLSearchParams,
  hash: URLSearchParams,
): Promise<{ ok: true; redirectPath: string } | { ok: false; error: string }> {
  const next = safeAuthRedirectPath(
    search.get("next") ?? search.get("redirect"),
    "/minha-jornada",
  );

  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token");
  const hashType = hash.get("type");

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) return { ok: false, error: error.message };
    const dest = hashType === "recovery" ? "/redefinir-senha" : next;
    return { ok: true, redirectPath: dest };
  }

  const tokenHash = search.get("token_hash");
  const type = search.get("type");

  if (tokenHash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, redirectPath: "/redefinir-senha" };
  }

  if (tokenHash && type && CONFIRM_OTP_TYPES.has(type as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, redirectPath: next };
  }

  const code = search.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const message = error.message.toLowerCase();
      if (
        message.includes("pkce") ||
        message.includes("code verifier") ||
        message.includes("invalid flow state")
      ) {
        return {
          ok: false,
          error:
            "pkce_verifier_missing: abra o link no mesmo navegador do cadastro ou solicite novo e-mail.",
        };
      }
      return { ok: false, error: error.message };
    }
    return { ok: true, redirectPath: next };
  }

  return { ok: false, error: "missing_auth_params" };
}

export async function waitForSession(
  supabase: SupabaseClient,
  attempts = 5,
): Promise<boolean> {
  for (let i = 0; i < attempts; i += 1) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) return true;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return false;
}
