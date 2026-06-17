"use client";

import { AuthLayout, AuthLink, AuthMessage } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updatePassword, type AuthActionState } from "@/lib/auth/actions";
import {
  establishRecoverySession,
  hasRecoverySession,
  parseRecoveryLinkParams,
} from "@/lib/auth/recovery-session";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/client";
import { useActionState, useEffect, useState } from "react";

const initialState: AuthActionState = {};

type SessionState = "checking" | "ready" | "invalid";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePassword,
    initialState,
  );
  const [sessionState, setSessionState] = useState<SessionState>("checking");
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapRecoverySession() {
      const supabase = createClient();
      const params = parseRecoveryLinkParams(
        window.location.search,
        window.location.hash,
      );

      if (params.kind !== "none") {
        const result = await establishRecoverySession(supabase, params);
        if (cancelled) return;

        if (result.error) {
          setSessionError(result.error);
          setSessionState("invalid");
          return;
        }

        window.history.replaceState({}, "", window.location.pathname);
      }

      const ready = await hasRecoverySession(supabase);
      if (cancelled) return;

      if (ready) {
        setSessionState("ready");
        return;
      }

      setSessionError(
        "Link inválido ou expirado. Solicite um novo link de recuperação.",
      );
      setSessionState("invalid");
    }

    void bootstrapRecoverySession();

    return () => {
      cancelled = true;
    };
  }, []);

  if (sessionState === "checking") {
    return (
      <AuthLayout
        title="Nova senha"
        description="Validando seu link de recuperação…"
      >
        <p className="text-center text-sm text-muted">Aguarde um instante.</p>
      </AuthLayout>
    );
  }

  if (sessionState === "invalid") {
    return (
      <AuthLayout
        title="Nova senha"
        description="Não foi possível validar o link de recuperação."
        footer={
          <>
            <AuthLink href={routes.recuperarSenha}>
              Solicitar novo link
            </AuthLink>
            {" · "}
            <AuthLink href={routes.entrar}>Voltar ao login</AuthLink>
          </>
        }
      >
        {sessionError && <AuthMessage type="error" message={sessionError} />}
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Nova senha"
      description="Defina uma nova senha segura para sua conta Saúde & Bem."
    >
      {state.error && <AuthMessage type="error" message={state.error} />}

      <form action={formAction} className="space-y-5">
        <Input
          label="Nova senha"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Mínimo 8 caracteres"
        />
        <Input
          label="Confirmar senha"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Repita a senha"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full justify-center"
          disabled={pending}
        >
          {pending ? "Salvando..." : "Redefinir senha"}
        </Button>
      </form>
    </AuthLayout>
  );
}
