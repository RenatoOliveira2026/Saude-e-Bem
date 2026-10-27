/**
 * Autorização das rotas de cron.
 *
 * A Vercel chama os crons com GET e o cabeçalho `Authorization: Bearer <CRON_SECRET>`.
 * Também aceitamos PAYMENTS_CRON_SECRET (chamadas manuais) por cabeçalho ou ?secret=.
 */
export function isCronAuthorized(
  request: Request,
  options: { allowServiceRole?: boolean; extraSecrets?: (string | null | undefined)[] } = {},
): boolean {
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  const querySecret = new URL(request.url).searchParams.get("secret");

  const secrets = [process.env.CRON_SECRET, process.env.PAYMENTS_CRON_SECRET, ...(options.extraSecrets ?? [])]
    .map((s) => s?.trim())
    .filter((s): s is string => Boolean(s));

  if (secrets.some((s) => s === bearer || s === querySecret)) return true;

  if (options.allowServiceRole) {
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (serviceRole && bearer === serviceRole) return true;
  }
  return false;
}
