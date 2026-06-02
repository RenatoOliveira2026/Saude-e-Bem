/** Erros em que a tabela ainda não existe no projeto Supabase */
export function isNewsletterTableMissingError(error: {
  code?: string;
  message?: string;
}): boolean {
  const code = error.code ?? "";
  const message = (error.message ?? "").toLowerCase();

  if (code === "PGRST205" || code === "42P01") {
    return true;
  }

  return (
    message.includes('relation "public.newsletter_subscribers" does not exist') ||
    message.includes("relation \"newsletter_subscribers\" does not exist") ||
    (message.includes("could not find the table") &&
      message.includes("newsletter_subscribers"))
  );
}

/** Falha de permissão após insert (ex.: RETURNING bloqueado por RLS) — não é tabela ausente */
export function isNewsletterPermissionError(error: {
  code?: string;
  message?: string;
}): boolean {
  const code = error.code ?? "";
  const message = (error.message ?? "").toLowerCase();

  return (
    code === "42501" ||
    message.includes("row-level security") ||
    message.includes("permission denied")
  );
}
