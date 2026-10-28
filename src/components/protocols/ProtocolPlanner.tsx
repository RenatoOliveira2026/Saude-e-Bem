"use client";

import { Icon } from "@/components/icons";
import type { ProtocolGuide } from "@/lib/data/protocol-guides";
import { googleCalendarLink } from "@/lib/protocols/reminders-calendar";
import { useMemo, useState, useSyncExternalStore } from "react";

interface ProtocolPlannerProps {
  slug: string;
  title: string;
  url: string;
  durationDays: number;
  guide: ProtocolGuide;
}

function toInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Próxima segunda-feira (ou daqui a 2 dias, se a segunda for amanhã). */
function suggestedStart(): string {
  const date = new Date();
  const daysToMonday = (8 - date.getDay()) % 7 || 7;
  date.setDate(date.getDate() + (daysToMonday < 2 ? daysToMonday + 7 : daysToMonday));
  return toInputValue(date);
}

function fromInput(value: string): Date | null {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

const dateFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "numeric", month: "numeric" });

function label(date: Date): string {
  return dateFormat.format(date).replace(".", "");
}

/** "07:00" → "7h"; "21:30" → "21h30". */
function clock(time: string): string {
  const [h, m] = time.split(":");
  return `${Number(h)}h${m === "00" ? "" : m}`;
}

function shift(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

/**
 * Escolha do dia de início + lembretes para a agenda do celular
 * (arquivo .ics para iPhone/Android/Outlook ou link do Google Agenda).
 */
export function ProtocolPlanner({ slug, title, url, durationDays, guide }: ProtocolPlannerProps) {
  // A data sugerida depende do relógio do aparelho: só é calculada no navegador.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [picked, setPicked] = useState<string | null>(null);
  const startValue = picked ?? (mounted ? suggestedStart() : "");
  const start = startValue ? fromInput(startValue) : null;
  const today = mounted ? toInputValue(new Date()) : undefined;

  const googleLink = useMemo(
    () =>
      start
        ? googleCalendarLink({ slug, title, url, startDate: startValue, durationDays, guide })
        : null,
    [start, slug, title, url, startValue, durationDays, guide],
  );

  return (
    <div className="rounded-2xl border border-sage/30 bg-surface p-6 shadow-card">
      <h2 className="flex items-center gap-2 font-heading text-2xl text-forest">
        <Icon name="plan" size={22} className="text-gold" />
        Programe seu início
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Escolha o dia 1 e leve os lembretes para a agenda do seu celular. Você recebe um aviso na
        véspera com o que preparar, lembretes diários nos horários certos e um alerta no início de
        cada etapa.
      </p>

      <label className="mt-5 block text-sm font-medium text-forest" htmlFor={`inicio-${slug}`}>
        Quando você quer começar?
      </label>
      <input
        id={`inicio-${slug}`}
        type="date"
        min={today}
        value={startValue}
        onChange={(event) => setPicked(event.target.value)}
        className="mt-2 h-11 w-full max-w-xs rounded-xl border border-border-strong bg-white px-4 text-graphite"
      />

      {start && (
        <>
          <ul className="mt-5 space-y-2 text-sm text-graphite">
            <li>
              <strong className="text-forest">{label(shift(start, -1))}, às 19h:</strong> aviso para
              deixar tudo pronto
            </li>
            {guide.weeks.map((week) => (
              <li key={week.title}>
                <strong className="text-forest">
                  {label(shift(start, week.fromDay - 1))} a {label(shift(start, week.toDay - 1))}:
                </strong>{" "}
                {week.focus}
              </li>
            ))}
            <li>
              <strong className="text-forest">Todos os dias:</strong>{" "}
              {guide.reminders.map((r) => `${clock(r.time)} ${r.title.toLowerCase()}`).join(" · ")}
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={`/api/protocolos/${slug}/lembretes?inicio=${startValue}`}
              download={`lembretes-${slug}.ics`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gold px-6 font-heading text-sm font-semibold text-graphite shadow-soft transition-colors hover:bg-gold-light"
            >
              <Icon name="download" size={18} />
              Adicionar à agenda
            </a>
            {googleLink && (
              <a
                href={googleLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border-strong px-6 font-heading text-sm font-semibold text-forest transition-colors hover:bg-sage-muted"
              >
                Abrir no Google Agenda
              </a>
            )}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            &quot;Adicionar à agenda&quot; baixa um arquivo com todos os lembretes: no iPhone toque em
            &quot;Adicionar tudo&quot;; no Android, abra o arquivo com o Google Agenda ou a agenda do
            celular. O Google Agenda pelo link recebe só o lembrete principal do dia.
          </p>
        </>
      )}
    </div>
  );
}
