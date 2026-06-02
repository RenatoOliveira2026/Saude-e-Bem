import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/icons";
import {
  formatSubscriptionDate,
  membershipPlanLabels,
  subscriptionStatusLabels,
} from "@/lib/club/constants";
import type { ClubDashboardData } from "@/lib/club/types";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface ClubDashboardProps {
  data: ClubDashboardData;
}

export function ClubDashboard({ data }: ClubDashboardProps) {
  const firstName = data.displayName.split(" ")[0];
  const { membership } = data;

  return (
    <div className="space-y-8">
      <section>
        <Badge variant="gold" className="mb-3">
          Área de membros
        </Badge>
        <h1 className="font-heading text-3xl text-forest md:text-4xl">
          Olá, {firstName}
        </h1>
        <p className="mt-3 max-w-2xl text-muted leading-relaxed">
          Bem-vindo ao Clube Saúde &amp; Bem. Acompanhe seu plano, favoritos e
          downloads em um só lugar.
        </p>
        <p className="mt-2 text-sm text-muted-light">
          Membro desde {data.memberSince}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Plano atual"
          value={membershipPlanLabels[membership.plan]}
          icon="star"
          highlight={membership.isPremium}
        />
        <StatCard
          label="Validade"
          value={
            membership.isPremium
              ? formatSubscriptionDate(membership.expiresAt)
              : "—"
          }
          icon="clock"
        />
        <StatCard
          label="Favoritos"
          value={String(data.favoritesCount)}
          icon="star"
          href={routes.clubeFavoritos}
        />
        <StatCard
          label="Downloads"
          value={String(data.downloadsCount)}
          icon="download"
          href={routes.clubeDownloads}
        />
      </section>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl text-forest">Sua assinatura</h2>
            <p className="mt-2 text-sm text-muted">
              Status:{" "}
              <strong className="text-forest">
                {subscriptionStatusLabels[membership.status]}
              </strong>
              {membership.provider && (
                <>
                  {" "}
                  · Provedor:{" "}
                  {membership.provider === "stripe" ? "Stripe" : "Manual"}
                </>
              )}
            </p>
            {membership.isPremium && membership.expiresAt && (
              <p className="mt-1 text-sm text-muted">
                Válida até {formatSubscriptionDate(membership.expiresAt)}
              </p>
            )}
          </div>
          {!membership.isPremium && (
            <Button href={routes.clubePremium} variant="gold" size="sm">
              Conhecer Premium
            </Button>
          )}
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-2">
        <PreviewList
          title="Favoritos recentes"
          emptyMessage="Você ainda não favoritou conteúdos."
          emptyHref={routes.protocolos}
          emptyLabel="Explorar protocolos"
          items={data.favorites.slice(0, 5).map((item) => ({
            id: item.id,
            title: item.title,
            meta: item.categoryLabel,
            href: item.href,
            premium: item.isPremium,
          }))}
          viewAllHref={routes.clubeFavoritos}
        />
        <PreviewList
          title="Downloads recentes"
          emptyMessage="Nenhum download registrado ainda."
          emptyHref={routes.biblioteca}
          emptyLabel="Ir à biblioteca"
          items={data.downloads.slice(0, 5).map((item) => ({
            id: item.id,
            title: item.contentTitle,
            meta: item.contentType,
            href: item.contentSlug
              ? item.contentType === "ebook"
                ? routes.bibliotecaItem(item.contentSlug)
                : item.contentType === "protocol"
                  ? routes.protocolo(item.contentSlug)
                  : routes.artigo(item.contentSlug)
              : routes.clubeDownloads,
          }))}
          viewAllHref={routes.clubeDownloads}
        />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  highlight,
  href,
}: {
  label: string;
  value: string;
  icon: "star" | "clock" | "download";
  highlight?: boolean;
  href?: string;
}) {
  const content = (
    <Card
      className={`p-5 ${href ? "transition-shadow hover:shadow-soft" : ""} ${highlight ? "border-gold/40 bg-gold-muted/20" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-light">
            {label}
          </p>
          <p className="mt-1 font-heading text-2xl text-forest">{value}</p>
        </div>
        <Icon name={icon} size={22} className="text-sage" />
      </div>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function PreviewList({
  title,
  items,
  emptyMessage,
  emptyHref,
  emptyLabel,
  viewAllHref,
}: {
  title: string;
  items: Array<{
    id: string;
    title: string;
    meta: string | null;
    href: string;
    premium?: boolean;
  }>;
  emptyMessage: string;
  emptyHref: string;
  emptyLabel: string;
  viewAllHref: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg text-forest">{title}</h2>
        <Link href={viewAllHref} className="text-sm text-sage hover:underline">
          Ver todos
        </Link>
      </div>
      {items.length === 0 ? (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted">{emptyMessage}</p>
          <Button href={emptyHref} variant="outline" size="sm" className="mt-4">
            {emptyLabel}
          </Button>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center justify-between gap-3 py-3 text-sm hover:text-sage"
              >
                <span className="font-medium text-forest">{item.title}</span>
                <span className="flex items-center gap-2 text-muted-light">
                  {item.premium && <Badge variant="gold">Premium</Badge>}
                  {item.meta}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
