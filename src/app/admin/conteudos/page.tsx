import { AdminHeader } from "@/components/admin/AdminHeader";
import { requireAdmin } from "@/lib/admin/session";
import { adminRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conteúdos — Admin" };

export default async function AdminConteudosPage() {
  const { email } = await requireAdmin();

  return (
    <>
      <AdminHeader
        title="Conteúdos"
        description="Gestão editorial — blog, protocolos e materiais legacy"
        email={email}
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-heading text-lg font-semibold text-forest">Blog e protocolos</h2>
          <p className="mt-1 text-sm text-muted">
            Artigos com categorias oficiais e protocolos publicados na plataforma.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href={adminRoutes.artigos} variant="primary" size="sm">
              Artigos
            </Button>
            <Button href={adminRoutes.artigoNovo} variant="outline" size="sm">
              Novo artigo
            </Button>
            <Button href={adminRoutes.protocolos} variant="secondary" size="sm">
              Protocolos
            </Button>
            <Button href={adminRoutes.protocoloNovo} variant="outline" size="sm">
              Novo protocolo
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-heading text-lg font-semibold text-forest">Biblioteca</h2>
          <p className="mt-1 text-sm text-muted">
            E-books gratuitos e premium na biblioteca inteligente, além dos materiais legacy.
          </p>
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
          <p className="mt-1 text-sm text-muted">
            Produtos digitais, afiliados e produtos próprios Saúde & Bem.
          </p>
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
          <p className="mt-4 text-xs text-muted-light">
            Ver página pública:{" "}
            <Link href="/marketplace" className="text-sage hover:underline">
              /marketplace
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
