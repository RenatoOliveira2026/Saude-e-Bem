/**
 * Garante TLS relaxado em dev para Server Actions (cadastro/login),
 * mesmo quando o processo não foi iniciado via scripts/with-env.mjs.
 */
export async function register() {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.SUPABASE_STRICT_TLS !== "1" &&
    process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0"
  ) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.warn(
      "[instrumentation] TLS relaxado em dev para Supabase Auth (NODE_TLS_REJECT_UNAUTHORIZED=0).",
    );
  }
}
