"use client";

import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/client";
import type { EmailOtpType } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CONFIRM_OTP_TYPES = new Set<EmailOtpType>([
  "signup",
  "email",
  "invite",
  "magiclink",
  "email_change",
]);

function safeRedirectPath(path: string | null): string {
  if (path?.startsWith("/") && !path.startsWith("//")) {
    return path;
  }
  return routes.minhaJornada;
}

function parseHashParams(hash: string): URLSearchParams {
  const trimmed = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(trimmed);
}

/**
 * Callback unificado de auth (Fase 8.4).
 * Trata hash (#access_token), token_hash (?type=signup) e PKCE (?code=) no cliente —
 * o servidor não recebe fragmentos de URL do e-mail de confirmação.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Confirmando seu acesso…");

  useEffect(() => {
    let cancelled = false;

    async function handleCallback() {
      const supabase = createClient();
      const search = new URLSearchParams(window.location.search);
      const hash = parseHashParams(window.location.hash);

      const next = safeRedirectPath(
        search.get("next") ?? search.get("redirect"),
      );

      if (search.get("error") || search.get("error_code")) {
        router.replace(`${routes.entrar}?error=auth_callback_failed`);
        return;
      }

      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const hashType = hash.get("type");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (cancelled) return;

        if (error) {
          console.error("[auth/callback] setSession failed:", error.message);
          router.replace(`${routes.entrar}?error=auth_callback_failed`);
          return;
        }

        const dest =
          hashType === "recovery" ? routes.redefinirSenha : next;
        window.history.replaceState({}, "", "/auth/callback");
        router.replace(dest);
        return;
      }

      const tokenHash = search.get("token_hash");
      const type = search.get("type");

      if (tokenHash && type === "recovery") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        if (cancelled) return;

        if (error) {
          console.error("[auth/callback] recovery verifyOtp:", error.message);
          router.replace(`${routes.recuperarSenha}?error=recovery_link_invalid`);
          return;
        }

        window.history.replaceState({}, "", "/auth/callback");
        router.replace(routes.redefinirSenha);
        return;
      }

      if (tokenHash && type && CONFIRM_OTP_TYPES.has(type as EmailOtpType)) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as EmailOtpType,
        });
        if (cancelled) return;

        if (error) {
          console.error(`[auth/callback] verifyOtp (${type}):`, error.message);
          router.replace(`${routes.entrar}?error=auth_callback_failed`);
          return;
        }

        window.history.replaceState({}, "", "/auth/callback");
        router.replace(next);
        return;
      }

      const code = search.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;

        if (error) {
          console.error(
            "[auth/callback] exchangeCodeForSession:",
            error.message,
          );
          router.replace(`${routes.entrar}?error=auth_callback_failed`);
          return;
        }

        window.history.replaceState({}, "", "/auth/callback");
        router.replace(next);
        return;
      }

      setMessage("Link inválido ou expirado.");
      router.replace(`${routes.entrar}?error=auth_callback_failed`);
    }

    void handleCallback();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-6 text-center">
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
