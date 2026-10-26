"use client";

import { BrandIcon } from "@/components/marketing/BrandIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { saveMarketingAccountsAction } from "@/lib/admin/actions/marketing.actions";
import type { AdminActionState } from "@/lib/admin/types";
import { SOCIAL_NETWORKS, type MarketingSettings } from "@/lib/marketing/accounts";
import { useActionState } from "react";

interface MarketingAccountsFormProps {
  settings: MarketingSettings;
  ga4Id: string | null;
  pixelFromEnv: boolean;
}

function StatusBadge({ connected, label }: { connected: boolean; label?: string }) {
  return connected ? (
    <Badge variant="sage" className="text-[11px]">
      {label ?? "Conectado"}
    </Badge>
  ) : (
    <Badge variant="outline" className="text-[11px]">
      Não conectado
    </Badge>
  );
}

function AccountRow({
  icon,
  title,
  description,
  status,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <li className="flex gap-4 border-t border-border p-5 first:border-t-0 sm:gap-5 sm:p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-off-white">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-base font-semibold text-forest">{title}</h3>
          {status}
        </div>
        <p className="mt-1 text-sm text-muted">{description}</p>
        {children && <div className="mt-3">{children}</div>}
      </div>
    </li>
  );
}

const inputClass =
  "w-full max-w-xl rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm text-graphite placeholder:text-muted-light focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20";

export function MarketingAccountsForm({
  settings,
  ga4Id,
  pixelFromEnv,
}: MarketingAccountsFormProps) {
  const [state, formAction, pending] = useActionState<AdminActionState, FormData>(
    saveMarketingAccountsAction,
    {},
  );

  const pixelConnected = Boolean(settings.meta_pixel_id) || pixelFromEnv;

  return (
    <form action={formAction} className="rounded-2xl border border-border bg-surface shadow-soft">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <h2 className="font-heading text-lg font-semibold text-forest">Contas</h2>
        <p className="mt-1 text-sm text-muted">
          Conecte as ferramentas de medição e os perfis do portal nas redes sociais.
        </p>
      </div>

      <ul>
        <AccountRow
          icon={<BrandIcon id="ga4" colored className="h-6 w-6" />}
          title="Google Analytics 4"
          description="Mede as visitas e o comportamento dos leitores no site."
          status={<StatusBadge connected={Boolean(ga4Id)} />}
        >
          {ga4Id && (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-lg bg-off-white px-3 py-1.5 font-mono text-xs text-forest">
                {ga4Id}
              </span>
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sage underline-offset-4 hover:underline"
              >
                Abrir o Analytics
              </a>
            </div>
          )}
        </AccountRow>

        <AccountRow
          icon={<BrandIcon id="search-console" colored className="h-6 w-6" />}
          title="Google Search Console"
          description="Mostra como o portal aparece nas buscas do Google."
          status={<StatusBadge connected />}
        >
          <a
            href="https://search.google.com/search-console?resource_id=sc-domain%3Asaudeebem.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-sage underline-offset-4 hover:underline"
          >
            Abrir o Search Console
          </a>
        </AccountRow>

        <AccountRow
          icon={<BrandIcon id="meta" colored className="h-6 w-6" />}
          title="Meta (Pixel do Facebook e Instagram)"
          description="Mede quem chega ao site pelos anúncios do Facebook e do Instagram. Cole o ID do Pixel, que fica no Gerenciador de Eventos da Meta."
          status={<StatusBadge connected={pixelConnected} />}
        >
          <label className="sr-only" htmlFor="meta_pixel_id">
            ID do Pixel da Meta
          </label>
          <input
            id="meta_pixel_id"
            name="meta_pixel_id"
            inputMode="numeric"
            defaultValue={settings.meta_pixel_id ?? ""}
            placeholder="Ex.: 1234567890123456"
            className={inputClass}
          />
          {pixelFromEnv && !settings.meta_pixel_id && (
            <p className="mt-2 text-xs text-muted">Hoje o Pixel vem da configuração da Vercel.</p>
          )}
        </AccountRow>

        {SOCIAL_NETWORKS.map((network) => {
          const key = `social_${network.id}` as const;
          return (
            <AccountRow
              key={network.id}
              icon={<BrandIcon id={network.id} colored className="h-6 w-6" />}
              title={network.label}
              description={network.description}
              status={<StatusBadge connected={Boolean(settings[key])} />}
            >
              <label className="sr-only" htmlFor={key}>
                Endereço do perfil no {network.label}
              </label>
              <input
                id={key}
                name={key}
                type="url"
                defaultValue={settings[key] ?? ""}
                placeholder={network.example}
                className={inputClass}
              />
            </AccountRow>
          );
        })}

        <AccountRow
          icon={<BrandIcon id="instagram" className="h-6 w-6 text-muted-light" />}
          title="Publicar direto nas redes"
          description="Postar no Instagram, Facebook e LinkedIn pelo painel. Depende da aprovação de um aplicativo pela Meta e pelo LinkedIn."
          status={
            <Badge variant="gold" className="text-[11px]">
              Em breve
            </Badge>
          }
        />
      </ul>

      <div className="flex flex-wrap items-center gap-4 border-t border-border px-5 py-4 sm:px-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar contas"}
        </Button>
        {state.error && (
          <p role="alert" className="text-sm text-red-700">
            {state.error}
          </p>
        )}
        {state.success && (
          <p role="status" className="text-sm font-medium text-sage">
            {state.success}
          </p>
        )}
      </div>
    </form>
  );
}
