"use client";

import {
  completeAuthFromUrl,
  parseHashParams,
  waitForSession,
} from "@/lib/auth/verify-session-client";
import { sendGa4EmailVerified } from "@/lib/analytics/growth-events";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Confirmação de e-mail / OAuth (Fase 8.5).
 * Trata hash (#access_token), token_hash e PKCE (?code=) no cliente.
 */
export default function AuthVerifyPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Confirmando seu acesso…");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const supabase = createClient();
      const search = new URLSearchParams(window.location.search);
      const hash = parseHashParams(window.location.hash);

      if (search.get("error") || search.get("error_code")) {
        router.replace(`${routes.entrar}?error=auth_callback_failed`);
        return;
      }

      const result = await completeAuthFromUrl(supabase, search, hash);
      if (cancelled) return;

      if (!result.ok) {
        if (result.error.startsWith("pkce_verifier_missing")) {
          router.replace(`${routes.entrar}?error=email_confirm_wrong_browser`);
          return;
        }
        if (result.error === "missing_auth_params") {
          router.replace(`${routes.entrar}?error=auth_callback_failed`);
          return;
        }
        console.error("[auth/verify]", result.error);
        router.replace(`${routes.entrar}?error=auth_callback_failed`);
        return;
      }

      const sessionReady = await waitForSession(supabase);
      if (cancelled) return;

      if (!sessionReady) {
        console.error("[auth/verify] sessão não persistida após confirmação");
        router.replace(`${routes.entrar}?error=auth_callback_failed`);
        return;
      }

      window.history.replaceState({}, "", "/auth/verify");
      sendGa4EmailVerified({ source: "auth_verify" });
      window.location.href = result.redirectPath;
    }

    void run();

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
