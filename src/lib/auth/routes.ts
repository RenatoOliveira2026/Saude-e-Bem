export const privateRoutes = [
  "/minha-jornada",
  "/perfil",
  "/assinar",
  "/minha-assinatura",
  "/clube/dashboard",
  "/clube/favoritos",
  "/clube/downloads",
  "/clube/perfil",
] as const;

/** Rotas do clube acessíveis sem login */
export const clubPublicRoutes = ["/clube", "/clube/premium"] as const;

/** Prefixos de conteúdo que pode exigir assinatura premium (gate na página + middleware leve) */
export const premiumContentPrefixes = [
  "/blog/",
  "/protocolos/",
  "/biblioteca/",
] as const;

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
