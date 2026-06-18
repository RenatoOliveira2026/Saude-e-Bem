export interface DashboardStats {
  users: number;
  articles: number;
  protocols: number;
  ebooks: number;
  libraryItems: number;
  marketplaceProducts: number;
  favorites: number;
  publishedTotal: number;
  draftsTotal: number;
  archivedTotal: number;
  affiliatesTotal: number;
  affiliatesActive: number;
  affiliatesFeatured: number;
  affiliateClicksTotal: number;
  affiliateClicksLast30Days: number;
  newsletterSubscribersTotal: number;
  newsletterSubscribersLast30Days: number;
}

export type { AffiliateLinkRecord as AffiliateLink, AffiliateLinkInput } from "@/lib/affiliates/types";

import type { AdminRole } from "./roles";

export interface AdminUserRow {
  id: string;
  email: string;
  name: string | null;
  full_name: string | null;
  cpf: string | null;
  celular: string | null;
  cep: string | null;
  cidade: string | null;
  estado: string | null;
  billing_complete: boolean;
  goal: string | null;
  created_at: string;
}

/** Registro em public.admin_users (equipe administrativa) */
export interface AdminTeamMember {
  id: string;
  user_id: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

export type AdminActionState = {
  error?: string;
  success?: string;
};

/** Placeholders para integrações futuras */
export const adminFutureIntegrations = [
  {
    id: "ia",
    title: "IA Saúde & Bem",
    description: "Assistente inteligente e recomendações personalizadas.",
    status: "em-breve" as const,
  },
];
