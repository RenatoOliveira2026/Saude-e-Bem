export const routes = {
  home: "/",
  blog: "/blog",
  protocolos: "/protocolos",
  ferramentas: "/ferramentas",
  biblioteca: "/biblioteca",
  recomendados: "/recomendados",
  obrigado: "/obrigado",
  clube: "/clube",
  clubeDashboard: "/clube/dashboard",
  clubeFavoritos: "/clube/favoritos",
  clubeDownloads: "/clube/downloads",
  clubePerfil: "/clube/perfil",
  clubePremium: "/clube/premium",
  entrar: "/entrar",
  cadastro: "/cadastro",
  recuperarSenha: "/recuperar-senha",
  redefinirSenha: "/redefinir-senha",
  minhaJornada: "/minha-jornada",
  perfil: "/perfil",
  protocolo: (slug: string) => `/protocolos/${slug}`,
  ferramenta: (slug: string) => `/ferramentas/${slug}`,
  bibliotecaItem: (slug: string) => `/biblioteca/${slug}`,
  artigo: (slug: string) => `/blog/${slug}`,
  recomendado: (slug: string) => `/recomendados/${slug}`,
  admin: "/admin",
} as const;

export const adminRoutes = {
  root: "/admin",
  artigos: "/admin/artigos",
  artigoNovo: "/admin/artigos/novo",
  artigoEditar: (id: string) => `/admin/artigos/${id}/editar`,
  protocolos: "/admin/protocolos",
  protocoloNovo: "/admin/protocolos/novo",
  protocoloEditar: (id: string) => `/admin/protocolos/${id}/editar`,
  biblioteca: "/admin/biblioteca",
  bibliotecaNovo: "/admin/biblioteca/novo",
  bibliotecaEditar: (id: string) => `/admin/biblioteca/${id}/editar`,
  usuarios: "/admin/usuarios",
  administradores: "/admin/administradores",
  configuracoes: "/admin/configuracoes",
  afiliados: "/admin/afiliados",
  afiliadoNovo: "/admin/afiliados/novo",
  afiliadoEditar: (id: string) => `/admin/afiliados/${id}/editar`,
  leads: "/admin/leads",
  leadsExport: "/api/admin/newsletter/export",
  analytics: "/admin/analytics",
} as const;

/** @deprecated Use getAdminNavForRole de @/lib/admin/nav */
export const adminNav = [
  { label: "Dashboard", href: adminRoutes.root, icon: "chart" as const },
  { label: "Artigos", href: adminRoutes.artigos, icon: "book" as const },
  { label: "Protocolos", href: adminRoutes.protocolos, icon: "sparkle" as const },
  { label: "Biblioteca", href: adminRoutes.biblioteca, icon: "library" as const },
  { label: "Usuários", href: adminRoutes.usuarios, icon: "users" as const },
] as const;

export type RouteKey = keyof typeof routes;

export const mainNav = [
  { label: "Início", href: routes.home },
  { label: "Blog", href: routes.blog },
  { label: "Protocolos", href: routes.protocolos },
  { label: "Ferramentas", href: routes.ferramentas },
  { label: "Biblioteca", href: routes.biblioteca },
  { label: "Clube Saúde & Bem", href: routes.clube },
] as const;

export const authNavLoggedOut = [
  { label: "Entrar", href: routes.entrar },
  { label: "Cadastrar", href: routes.cadastro },
] as const;

export const authNavLoggedIn = [
  { label: "Minha Jornada", href: routes.minhaJornada },
  { label: "Clube", href: routes.clubeDashboard },
  { label: "Perfil", href: routes.perfil },
] as const;

export const footerNav = {
  plataforma: [
    { label: "Blog", href: routes.blog },
    { label: "Protocolos", href: routes.protocolos },
    { label: "Ferramentas", href: routes.ferramentas },
    { label: "Biblioteca", href: routes.biblioteca },
    { label: "Recomendados", href: routes.recomendados },
  ],
  conta: [
    { label: "Minha Jornada", href: routes.minhaJornada },
    { label: "Perfil", href: routes.perfil },
    { label: "Entrar", href: routes.entrar },
    { label: "Cadastrar", href: routes.cadastro },
  ],
  comunidade: [
    { label: "Clube Saúde & Bem", href: routes.clube },
    { label: "Sobre", href: "#" },
    { label: "Contato", href: "#" },
  ],
} as const;

export const crossNav = [
  { label: "Protocolos", href: routes.protocolos, icon: "sparkle" as const },
  { label: "Ferramentas", href: routes.ferramentas, icon: "chart" as const },
  { label: "Biblioteca", href: routes.biblioteca, icon: "library" as const },
  { label: "Blog", href: routes.blog, icon: "book" as const },
  { label: "Clube", href: routes.clube, icon: "star" as const },
] as const;
