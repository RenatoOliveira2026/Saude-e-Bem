import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/clube/",
          "/dev-login",
          "/entrar",
          "/cadastro",
          "/perfil",
          "/minha-jornada",
          "/minha-saude",
          "/protocolos/painel",
          "/protocolos/recentes",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
