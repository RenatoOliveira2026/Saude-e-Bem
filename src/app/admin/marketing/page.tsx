import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { MarketingAccountsForm } from "@/components/admin/marketing/MarketingAccountsForm";
import { Icon, type IconName } from "@/components/icons";
import { getConversionDashboard } from "@/lib/admin/services/conversion.service";
import { getNewsletterLeadStats } from "@/lib/admin/services/newsletter.service";
import { adminListAffiliateLinks } from "@/lib/admin/services/affiliates.service";
import { requireAdmin } from "@/lib/admin/session";
import { getGa4MeasurementId } from "@/lib/analytics/ga4-config";
import { getMarketingSettings } from "@/lib/marketing/settings";
import { adminRoutes } from "@/lib/routes";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Marketing — Admin" };
export const dynamic = "force-dynamic";

const TOOLS: { label: string; href: string; icon: IconName; description: string }[] = [
  {
    label: "Leads",
    href: adminRoutes.leads,
    icon: "users",
    description: "Contatos captados no site e o funil de cada um.",
  },
  {
    label: "Newsletter",
    href: adminRoutes.newsletter,
    icon: "book",
    description: "Inscritos, origem de cada cadastro e exportação.",
  },
  {
    label: "Conversão",
    href: adminRoutes.conversao,
    icon: "chart",
    description: "Leads quentes, automações de e-mail e taxas por origem.",
  },
  {
    label: "WhatsApp",
    href: adminRoutes.comunicacao,
    icon: "support",
    description: "Mensagens, modelos e contatos que aceitaram receber.",
  },
  {
    label: "Afiliados",
    href: adminRoutes.afiliados,
    icon: "star",
    description: "Links de produtos recomendados e os cliques de cada um.",
  },
  {
    label: "Lançamento",
    href: adminRoutes.lancamento,
    icon: "activity",
    description: "Checklist diário e saúde das campanhas de lançamento.",
  },
];

async function safe<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch {
    return null;
  }
}

export default async function AdminMarketingPage() {
  const { email, role } = await requireAdmin();

  const [settings, newsletter, conversion, affiliates] = await Promise.all([
    getMarketingSettings(),
    safe(getNewsletterLeadStats()),
    safe(getConversionDashboard()),
    safe(adminListAffiliateLinks()),
  ]);

  const show = (value: number | undefined | null) =>
    typeof value === "number" ? value : "—";

  return (
    <>
      <AdminHeader
        title="Marketing"
        description="Contas conectadas, captação de leads e campanhas em um só lugar"
        email={email}
        role={role}
      />
      <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Inscritos na newsletter"
            value={show(newsletter?.active)}
            icon="users"
            accent="forest"
          />
          <AdminStatCard
            label="Leads no total"
            value={show(conversion?.totalLeads)}
            icon="activity"
          />
          <AdminStatCard
            label="Leads quentes"
            value={show(conversion?.hotLeads)}
            icon="bolt"
            accent="gold"
          />
          <AdminStatCard
            label="Links de afiliados ativos"
            value={show(affiliates?.filter((a) => a.active).length)}
            icon="star"
          />
        </div>

        <MarketingAccountsForm
          settings={settings}
          ga4Id={getGa4MeasurementId()}
          pixelFromEnv={Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim())}
        />

        <section>
          <h2 className="font-heading text-lg font-semibold text-forest">
            Ferramentas de marketing
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft transition-colors hover:border-sage"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage/10 text-sage">
                  <Icon name={tool.icon} className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="font-heading text-base font-semibold text-forest group-hover:text-sage">
                    {tool.label}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{tool.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
