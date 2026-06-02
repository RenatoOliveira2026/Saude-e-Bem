export const privateRoutes = ["/minha-jornada", "/perfil"] as const;

/** Painel administrativo — exige login; autorização em requireAdmin() */
export const adminProtectedRoutes = ["/admin"] as const;

export const authRoutes = [
  "/entrar",
  "/cadastro",
  "/recuperar-senha",
] as const;

export const publicRoutes = [
  "/",
  "/blog",
  "/protocolos",
  "/ferramentas",
  "/biblioteca",
  "/clube",
] as const;
