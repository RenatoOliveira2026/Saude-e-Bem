"use client";

import { Icon } from "@/components/icons";
import { FOUNDER_CAMPAIGN_ENDS_AT } from "@/lib/payments/founder";
import { CLUB_PRICING } from "@/lib/payments/pricing";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

const ENDS_AT = new Date(FOUNDER_CAMPAIGN_ENDS_AT).getTime();
const DISMISS_KEY = "founder-banner-dismissed";

function useNow(intervalMs: number): number | null {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!mounted) return;
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, intervalMs);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [mounted, intervalMs]);
  return now;
}

function remaining(now: number): string {
  const ms = Math.max(0, ENDS_AT - now);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  if (days >= 2) return `Faltam ${days} dias`;
  if (days === 1) return `Falta 1 dia e ${hours} h`;
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  return `Últimas ${hours} h ${minutes} min`;
}

/** Faixa fina no topo do site durante a campanha. Some depois de 30/11 ou se a pessoa fechar. */
export function FounderBanner() {
  const now = useNow(60_000);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_KEY) === "1") {
        const id = window.setTimeout(() => setDismissed(true), 0);
        return () => window.clearTimeout(id);
      }
    } catch {
      // armazenamento indisponível: mostra a faixa
    }
  }, []);

  if (dismissed || (now !== null && now > ENDS_AT)) return null;

  function close() {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignora
    }
  }

  return (
    <div className="bg-forest text-off-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-sm">
        <p className="min-w-0 flex-1 leading-snug">
          <strong className="font-semibold">Preço de fundador do Clube:</strong>{" "}
          <span className="whitespace-nowrap">{CLUB_PRICING.premiumMonthly.label}/mês</span> ou{" "}
          <span className="whitespace-nowrap">{CLUB_PRICING.premiumAnnual.label}/ano</span>, garantido
          nas renovações. Só até 30/11.{" "}
          <Link href={`${routes.clube}#fundador`} className="font-semibold text-gold-light underline underline-offset-2">
            Garantir meu preço
          </Link>
        </p>
        <button
          type="button"
          onClick={close}
          aria-label="Fechar aviso"
          className="shrink-0 rounded-full px-2 py-1 text-off-white/80 hover:bg-white/10 hover:text-off-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/** Bloco da campanha com contagem regressiva (página do Clube e de assinatura). */
export function FounderCampaignCard({ showButtons = true }: { showButtons?: boolean }) {
  const now = useNow(30_000);
  if (now !== null && now > ENDS_AT) return null;

  return (
    <div id="fundador" className="scroll-mt-28 rounded-2xl border border-gold/40 bg-gold-muted/20 p-6 md:p-8">
      <p className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 font-heading text-xs font-semibold uppercase tracking-wide text-graphite">
        <Icon name="star" size={14} />
        Preço de fundador
      </p>
      <h2 className="mt-4 font-heading text-2xl text-forest md:text-3xl">
        Assine até 30 de novembro e mantenha este preço
      </h2>
      <p className="mt-3 text-muted leading-relaxed">
        Quem assinar o Clube até 30/11 paga {CLUB_PRICING.premiumMonthly.label} por mês ou{" "}
        {CLUB_PRICING.premiumAnnual.label} por ano em todas as renovações, mesmo que o preço do Clube
        suba depois. O valor fica ligado à sua conta: não precisa de cupom.
      </p>
      <p className="mt-4 font-heading text-lg font-semibold text-forest" aria-live="polite">
        {now === null ? "Só até 30/11, às 23h59" : `${remaining(now)} · até 30/11, às 23h59`}
      </p>
      {showButtons && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`${routes.assinar}?plano=premium_annual`}
            className="inline-flex h-12 items-center justify-center rounded-full bg-gold px-8 font-heading font-semibold text-graphite shadow-soft hover:bg-gold-light"
          >
            Anual · {CLUB_PRICING.premiumAnnual.label}
          </Link>
          <Link
            href={`${routes.assinar}?plano=premium_monthly`}
            className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong px-8 font-heading font-semibold text-forest hover:bg-sage-muted"
          >
            Mensal · {CLUB_PRICING.premiumMonthly.label}
          </Link>
        </div>
      )}
    </div>
  );
}
