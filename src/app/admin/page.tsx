import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { adminFutureIntegrations } from "@/lib/admin/types";
import { getDashboardStats } from "@/lib/admin/services/dashboard.service";
import { hasAdminPermission } from "@/lib/admin/roles";
import { requireAdmin } from "@/lib/admin/session";
import { adminRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const { email, role } = await requireAdmin();
  const stats = await getDashboardStats();

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Visão geral da plataforma Saúde & Bem"
        email={email}
        role={role}
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Usuários" value={stats.users} icon="users" accent="forest" />
          <AdminStatCard label="Artigos" value={stats.articles} icon="book" accent="sage" />
          <AdminStatCard label="Protocolos" value={stats.protocols} icon="sparkle" accent="gold" />
          <AdminStatCard label="E-books" value={stats.ebooks} icon="library" accent="sage" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <AdminStatCard
            label="Afiliados"
            value={stats.affiliatesTotal}
            icon="star"
            accent="forest"
          />
          <AdminStatCard
            label="Afiliados ativos"
            value={stats.affiliatesActive}
            icon="checklist"
            accent="sage"
          />
          <AdminStatCard
            label="Em destaque"
            value={stats.affiliatesFeatured}
            icon="sparkle"
            accent="gold"
          />
          <AdminStatCard
            label="Cliques totais"
            value={stats.affiliateClicksTotal}
            icon="chart"
            accent="forest"
          />
          <AdminStatCard
            label="Cliques (30 dias)"
            value={stats.affiliateClicksLast30Days}
            icon="activity"
            accent="sage"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminStatCard
            label="Leads newsletter"
            value={stats.newsletterSubscribersTotal}
            icon="activity"
            accent="forest"
          />
          <AdminStatCard
            label="Leads (30 dias)"
            value={stats.newsletterSubscribersLast30Days}
            icon="users"
            accent="sage"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <AdminStatCard
            label="Publicados"
            value={stats.publishedTotal}
            icon="checklist"
            accent="forest"
          />
          <AdminStatCard
            label="Rascunhos"
            value={stats.draftsTotal}
            icon="book"
            accent="gold"
          />
          <AdminStatCard
            label="Arquivados"
            value={stats.archivedTotal}
            icon="library"
            accent="sage"
          />
        </div>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-heading text-lg font-semibold text-forest">Conteúdos</h2>
          <p className="mt-1 text-sm text-muted">Blog e protocolos editoriais.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Artigos" value={stats.articles} icon="book" accent="sage" />
            <AdminStatCard label="Protocolos" value={stats.protocols} icon="sparkle" accent="gold" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href={adminRoutes.conteudos} variant="primary" size="sm">
              Hub de conteúdos
            </Button>
            <Button href={adminRoutes.artigoNovo} variant="outline" size="sm">
              Novo artigo
            </Button>
            <Button href={adminRoutes.protocoloNovo} variant="outline" size="sm">
              Novo protocolo
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-heading text-lg font-semibold text-forest">Biblioteca</h2>
          <p className="mt-1 text-sm text-muted">E-books gratuitos e premium na biblioteca digital.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Itens digitais" value={stats.libraryItems} icon="library" accent="sage" />
            <AdminStatCard label="E-books legacy" value={stats.ebooks} icon="book" accent="forest" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href={adminRoutes.bibliotecaItens} variant="primary" size="sm">
              Biblioteca digital
            </Button>
            <Button href={adminRoutes.bibliotecaItemNovo} variant="outline" size="sm">
              Novo e-book
            </Button>
            <Button href={adminRoutes.biblioteca} variant="ghost" size="sm">
              Materiais legacy
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-heading text-lg font-semibold text-forest">Marketplace</h2>
          <p className="mt-1 text-sm text-muted">Produtos digitais, afiliados e próprios.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Produtos" value={stats.marketplaceProducts} icon="star" accent="gold" />
            <AdminStatCard label="Afiliados" value={stats.affiliatesTotal} icon="star" accent="forest" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href={adminRoutes.marketplace} variant="primary" size="sm">
              Marketplace
            </Button>
            <Button href={adminRoutes.marketplaceNovo} variant="outline" size="sm">
              Novo produto
            </Button>
            <Button href={adminRoutes.afiliados} variant="ghost" size="sm">
              Afiliados
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-heading text-lg font-semibold text-forest">
            Ações rápidas
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href={adminRoutes.artigoNovo} variant="primary" size="sm">
              Novo artigo
            </Button>
            <Button href={adminRoutes.protocoloNovo} variant="secondary" size="sm">
              Novo protocolo
            </Button>
            <Button href={adminRoutes.bibliotecaNovo} variant="outline" size="sm">
              Novo material
            </Button>
            <Button href={adminRoutes.afiliadoNovo} variant="outline" size="sm">
              Novo afiliado
            </Button>
            <Button href={adminRoutes.leads} variant="ghost" size="sm">
              Ver leads
            </Button>
            {hasAdminPermission(role, "manage_platform_users") && (
              <Button href={adminRoutes.usuarios} variant="ghost" size="sm">
                Ver usuários
              </Button>
            )}
            {hasAdminPermission(role, "manage_admins") && (
              <Button href={adminRoutes.administradores} variant="ghost" size="sm">
                Administradores
              </Button>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-heading text-lg font-semibold text-forest">
            Integrações futuras
          </h2>
          <p className="mt-1 text-sm text-muted">
            Módulos preparados para as próximas fases do projeto.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {adminFutureIntegrations.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-dashed border-border bg-off-white p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading text-sm font-semibold text-forest">
                    {item.title}
                  </h3>
                  <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-medium text-forest">
                    Em breve
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-light">
            Links de gestão:{" "}
            <Link href={adminRoutes.artigos} className="text-sage hover:underline">
              Artigos
            </Link>
            {" · "}
            <Link href={adminRoutes.protocolos} className="text-sage hover:underline">
              Protocolos
            </Link>
            {" · "}
            <Link href={adminRoutes.biblioteca} className="text-sage hover:underline">
              Biblioteca
            </Link>
            {" · "}
            <Link href={adminRoutes.afiliados} className="text-sage hover:underline">
              Afiliados
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
