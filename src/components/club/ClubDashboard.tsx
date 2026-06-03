import { PaymentHistoryList } from "@/components/payments";
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
import { AiRecommendationsPanel } from "./AiRecommendationsPanel";
import { ContinueReadingSection } from "./ContinueReadingSection";
import { ContentRankingsList } from "./ContentRankingsList";

interface ClubDashboardProps {
  data: ClubDashboardData;
}

export function ClubDashboard({ data }: ClubDashboardProps) {
  const firstName = data.displayName.split(" ")[0];
  const { membership, stats } = data;

  return (
    <div className="space-y-8">
      <section>
        <Badge variant="gold" className="mb-3">
          {membership.isPremium ? "Assinante Premium" : "Área de membros"}
        </Badge>
        <h1 className="font-heading text-3xl text-forest md:text-4xl">
          Dashboard Premium Inteligente
        </h1>
        <p className="mt-3 max-w-2xl text-muted leading-relaxed">
          Olá, {firstName} — continue lendo, explore recomendações IA e acompanhe
          seu progresso na plataforma.
        </p>
        <p className="mt-2 text-sm text-muted-light">
          Membro desde {data.memberSince}
          {stats.goalLabel && (
            <>
              {" "}
              · Objetivo: <strong className="text-forest">{stats.goalLabel}</strong>
            </>
          )}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Dias como membro"
          value={String(stats.daysAsMember)}
          icon="clock"
        />
        <StatCard
          label="Favoritos"
          value={String(stats.favoritesCount)}
          icon="star"
          href={routes.clubeFavoritos}
        />
        <StatCard
          label="Downloads"
          value={String(stats.downloadsCount)}
          icon="download"
          href={routes.clubeDownloads}
        />
        <StatCard
          label="Protocolos salvos"
          value={String(stats.protocolsSavedCount)}
          icon="plan"
          href={routes.clubeProtocolosSalvos}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Plano"
          value={membershipPlanLabels[membership.plan]}
          icon="star"
          highlight={membership.isPremium}
        />
        <StatCard
          label="Concluídos"
          value={String(stats.protocolsCompletedCount)}
          icon="checklist"
        />
        <StatCard
          label="Acessos registrados"
          value={String(stats.accessCount)}
          icon="activity"
          href={routes.clubeHistorico}
        />
        <StatCard
          label="Perfil"
          value={stats.profileComplete ? "Completo" : "Incompleto"}
          icon="profile"
          href={stats.profileComplete ? routes.clubePerfil : routes.minhaJornada}
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
            </p>
            {membership.isPremium && data.nextRenewal && (
              <p className="mt-1 text-sm text-muted">
                Próxima renovação: {formatSubscriptionDate(data.nextRenewal)}
              </p>
            )}
          </div>
          {!membership.isPremium ? (
            <Button href={routes.assinar} variant="gold" size="sm">
              Assinar Premium
            </Button>
          ) : (
            <Button href={routes.minhaAssinatura} variant="outline" size="sm">
              Minha assinatura
            </Button>
          )}
        </div>
      </Card>

      <ContinueReadingSection items={data.continueReading} />

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl text-forest">
            Recomendações IA
          </h2>
          <Link
            href={routes.clubeRecomendacoesIa}
            className="text-sm text-sage hover:underline"
          >
            Ver página completa
          </Link>
        </div>
        <AiRecommendationsPanel
          recommendations={data.intelligentRecommendations.slice(0, 4)}
          title=""
          showKind
        />
      </section>

      <ContentRankingsList
        rankings={data.contentRankings.slice(0, 5)}
        title="Conteúdos em alta (30 dias)"
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <PreviewList
          title="Favoritos recentes"
          emptyMessage="Você ainda não favoritou conteúdos."
          emptyHref={routes.blog}
          emptyLabel="Explorar blog"
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
          title="Protocolos salvos"
          emptyMessage="Salve protocolos para acompanhar seu progresso."
          emptyHref={routes.protocolos}
          emptyLabel="Ver protocolos"
          items={data.savedProtocols.slice(0, 5).map((item) => ({
            id: item.id,
            title: item.title,
            meta: item.status,
            href: item.href,
            premium: item.isPremium,
          }))}
          viewAllHref={routes.clubeProtocolosSalvos}
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
        <PreviewList
          title="Histórico de acessos"
          emptyMessage="Nenhum acesso registrado ainda."
          emptyHref={routes.protocolos}
          emptyLabel="Explorar conteúdo"
          items={data.accessHistory.slice(0, 5).map((item) => ({
            id: item.id,
            title: item.contentTitle,
            meta: item.contentType,
            href: item.href,
          }))}
          viewAllHref={routes.clubeHistorico}
        />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl text-forest">
            Histórico de pagamentos
          </h2>
          <Link
            href={routes.minhaAssinatura}
            className="text-sm text-sage hover:underline"
          >
            Ver assinatura
          </Link>
        </div>
        <PaymentHistoryList payments={data.payments.slice(0, 5)} />
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
  icon: "star" | "clock" | "download" | "plan" | "checklist" | "activity" | "profile";
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
