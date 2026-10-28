import type { ProtocolGuide } from "@/lib/data/protocol-guides";

/**
 * Lembretes do protocolo em formato de agenda (.ics), que o iPhone, o
 * Android (Google Agenda, Samsung) e o Outlook importam com um toque.
 *
 * Horários sem fuso ("floating"): 07:00 vira 07:00 no relógio do celular.
 */

export interface ReminderCalendarInput {
  slug: string;
  title: string;
  url: string;
  /** "AAAA-MM-DD" do dia 1. */
  startDate: string;
  durationDays: number;
  guide: ProtocolGuide;
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseStartDate(value: string | null | undefined): Date | null {
  const match = value?.match(DATE_RE);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return Number.isNaN(date.getTime()) ? null : date;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

function ymd(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

function localStamp(date: Date, time: string): string {
  return `${ymd(date)}T${time.replace(":", "")}00`;
}

function plusMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = Math.min(h * 60 + m + minutes, 23 * 60 + 59);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Linhas de no máximo 75 caracteres, como pede o padrão. */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 0) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  return parts.join("\r\n");
}

interface CalendarEvent {
  uid: string;
  start: string;
  end: string;
  summary: string;
  description: string;
  rrule?: string;
}

function eventLines(event: CalendarEvent, stamp: string): string[] {
  return [
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${event.start}`,
    `DTEND:${event.end}`,
    ...(event.rrule ? [`RRULE:${event.rrule}`] : []),
    `SUMMARY:${escapeText(event.summary)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(event.summary)}`,
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
  ];
}

export function buildReminderEvents(input: ReminderCalendarInput, start: Date): CalendarEvent[] {
  const { guide, slug, title, url, durationDays } = input;
  const startKey = ymd(start);
  const events: CalendarEvent[] = [];
  const bullets = (items: string[]) => items.map((item) => `• ${item}`).join("\n");

  const eve = addDays(start, -1);
  events.push({
    uid: `${slug}-vespera-${startKey}@saudeebem.com.br`,
    start: localStamp(eve, "19:00"),
    end: localStamp(eve, "19:15"),
    summary: `Amanhã começa: ${title}`,
    description: `Deixe pronto hoje:\n${bullets(guide.prepare)}${
      guide.shopping?.length ? `\n\nLista de compras:\n${bullets(guide.shopping)}` : ""
    }\n\nProtocolo completo: ${url}`,
  });

  guide.reminders.forEach((reminder, index) => {
    events.push({
      uid: `${slug}-lembrete-${index}-${startKey}@saudeebem.com.br`,
      start: localStamp(start, reminder.time),
      end: localStamp(start, plusMinutes(reminder.time, 15)),
      rrule: `FREQ=DAILY;COUNT=${durationDays}`,
      summary: `${reminder.title} · ${title}`,
      description: `${reminder.detail}\n\nProtocolo: ${url}`,
    });
  });

  guide.weeks.forEach((week, index) => {
    const day = addDays(start, week.fromDay - 1);
    events.push({
      uid: `${slug}-etapa-${index}-${startKey}@saudeebem.com.br`,
      start: localStamp(day, "08:00"),
      end: localStamp(day, "08:15"),
      summary: `${week.title}: ${week.focus} · ${title}`,
      description: `O que fazer nesta etapa:\n${bullets(week.tasks)}\n\nProtocolo: ${url}`,
    });
  });

  const last = addDays(start, durationDays - 1);
  events.push({
    uid: `${slug}-fim-${startKey}@saudeebem.com.br`,
    start: localStamp(last, "20:00"),
    end: localStamp(last, "20:15"),
    summary: `Último dia: ${title}`,
    description: `Parabéns por chegar até aqui! Compare com o seu ponto de partida e escolha o que vira rotina.\n\nProtocolo: ${url}`,
  });

  return events;
}

export function buildReminderCalendar(input: ReminderCalendarInput): string | null {
  const start = parseStartDate(input.startDate);
  if (!start) return null;

  const stamp = `${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Saude e Bem//Protocolos//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(`Saúde & Bem · ${input.title}`)}`,
    ...buildReminderEvents(input, start).flatMap((event) => eventLines(event, stamp)),
    "END:VCALENDAR",
  ];

  return `${lines.map(fold).join("\r\n")}\r\n`;
}

/** Link do Google Agenda com o primeiro lembrete diário, repetido pelo protocolo inteiro. */
export function googleCalendarLink(input: ReminderCalendarInput): string | null {
  const start = parseStartDate(input.startDate);
  const first = input.guide.reminders[0];
  if (!start || !first) return null;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${first.title} · ${input.title}`,
    dates: `${localStamp(start, first.time)}/${localStamp(start, plusMinutes(first.time, 15))}`,
    ctz: "America/Sao_Paulo",
    details: `${first.detail}\n\nProtocolo: ${input.url}`,
    recur: `RRULE:FREQ=DAILY;COUNT=${input.durationDays}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
