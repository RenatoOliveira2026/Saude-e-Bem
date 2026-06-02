"use client";

import { AuthLayout, AuthLink, AuthMessage } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import {
  devLoginAsRenato,
  type DevLoginState,
} from "@/lib/auth/dev-login.actions";
import { DEV_LOGIN_EMAIL, DEV_LOGIN_MANUAL_SQL } from "@/lib/auth/dev-login";
import { routes } from "@/lib/routes";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

const initialState: DevLoginState = {};

export function DevLoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? routes.minhaJornada;
  const [state, formAction, pending] = useActionState(devLoginAsRenato, initialState);

  return (
    <AuthLayout
      title="Dev login"
      description="Acesso local de desenvolvimento — não disponível em produção."
      footer={
        <>
          <AuthLink href={routes.entrar}>Login normal</AuthLink>
          {" · "}
          <AuthLink href={routes.home}>Home</AuthLink>
        </>
      }
    >
      <p className="rounded-lg border border-dashed border-gold/40 bg-gold/10 px-4 py-3 text-sm text-forest">
        <strong>Ambiente local.</strong> Sessão via Supabase Auth, sem confirmação de e-mail.
        <br />
        E-mail: <code className="text-xs">{DEV_LOGIN_EMAIL}</code>
      </p>

      {state.error && <AuthMessage type="error" message={state.error} />}

      {state.hint && (
        <pre className="max-h-40 overflow-auto rounded-lg border border-border bg-off-white p-3 text-xs text-muted">
          {state.hint ?? DEV_LOGIN_MANUAL_SQL}
        </pre>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="redirect" value={redirect} />
        <Button
          type="submit"
          variant="gold"
          size="md"
          className="w-full justify-center"
          disabled={pending}
        >
          {pending ? "Entrando..." : "Entrar como Renato"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-light">
        Admin: use{" "}
        <code className="text-forest">?redirect=/admin</code> na URL desta página.
      </p>
    </AuthLayout>
  );
}
