import type { SupabaseClient } from "@supabase/supabase-js";

export type RecoveryLinkParams =
  | { kind: "none" }
  | { kind: "hash_tokens"; accessToken: string; refreshToken: string }
  | { kind: "token_hash"; tokenHash: string };

function parseHashParams(hash: string): URLSearchParams {
  const trimmed = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(trimmed);
}

/** Lê parâmetros de recovery na query (?token_hash&type=recovery) ou no hash (#access_token&…). */
export function parseRecoveryLinkParams(
  search: string,
  hash: string,
): RecoveryLinkParams {
  const query = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const tokenHash = query.get("token_hash");
  const type = query.get("type");

  if (tokenHash && type === "recovery") {
    return { kind: "token_hash", tokenHash };
  }

  const hashParams = parseHashParams(hash);
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");
  const hashType = hashParams.get("type");

  if (accessToken && refreshToken && hashType === "recovery") {
    return { kind: "hash_tokens", accessToken, refreshToken };
  }

  return { kind: "none" };
}

export async function establishRecoverySession(
  supabase: SupabaseClient,
  params: RecoveryLinkParams,
): Promise<{ error?: string }> {
  if (params.kind === "token_hash") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: params.tokenHash,
      type: "recovery",
    });
    if (error) return { error: error.message };
    return {};
  }

  if (params.kind === "hash_tokens") {
    const { error } = await supabase.auth.setSession({
      access_token: params.accessToken,
      refresh_token: params.refreshToken,
    });
    if (error) return { error: error.message };
    return {};
  }

  return {};
}

export async function hasRecoverySession(
  supabase: SupabaseClient,
): Promise<boolean> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return !error && Boolean(user);
}
