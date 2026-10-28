import { getProtocolGuide, protocolDurationDays } from "@/lib/data/protocol-guides";
import { getProtocolBySlug } from "@/lib/data/repositories/protocols.repository";
import { buildReminderCalendar } from "@/lib/protocols/reminders-calendar";
import { routes } from "@/lib/routes";
import { isValidPublicSlug, notFoundSeoHeaders } from "@/lib/seo/slug";
import { getSiteUrl } from "@/lib/seo/site-url";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/** Arquivo de agenda (.ics) com os lembretes do protocolo, a partir da data escolhida. */
export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const notFound = () => new NextResponse(null, { status: 404, headers: notFoundSeoHeaders() });

  if (!isValidPublicSlug(slug)) return notFound();

  const guide = getProtocolGuide(slug);
  const protocol = guide ? await getProtocolBySlug(slug) : null;
  if (!guide || !protocol) return notFound();

  const startDate = new URL(request.url).searchParams.get("inicio") ?? "";
  const calendar = buildReminderCalendar({
    slug,
    title: protocol.title,
    url: `${getSiteUrl()}${routes.protocolo(slug)}`,
    startDate,
    durationDays: protocolDurationDays(protocol.duration, guide),
    guide,
  });

  if (!calendar) {
    return NextResponse.json({ error: "Data de início inválida. Use AAAA-MM-DD." }, { status: 400 });
  }

  return new NextResponse(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="lembretes-${slug}.ics"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
