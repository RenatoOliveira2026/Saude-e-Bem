import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";
import { NextResponse } from "next/server";

function safeRedirectPath(path: string | null): string {
  if (path?.startsWith("/") && !path.startsWith("//")) {
    return path;
  }
  return routes.minhaJornada;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? searchParams.get("redirect");

  const supabase = await createClient();

  if (tokenHash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });

    if (!error) {
      return NextResponse.redirect(`${origin}${routes.redefinirSenha}`);
    }

    return NextResponse.redirect(
      `${origin}${routes.recuperarSenha}?error=recovery_link_invalid`,
    );
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const safePath = safeRedirectPath(next);
      return NextResponse.redirect(`${origin}${safePath}`);
    }
  }

  return NextResponse.redirect(`${origin}${routes.entrar}?error=auth_callback_failed`);
}
