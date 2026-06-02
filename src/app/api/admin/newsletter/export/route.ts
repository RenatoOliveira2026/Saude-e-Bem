import { adminListNewsletterSubscribers } from "@/lib/admin/services/newsletter.service";
import { getAdminSession } from "@/lib/admin/session";
import { subscribersToCsv } from "@/lib/newsletter/csv";
import { isNewsletterSource } from "@/lib/newsletter/sources";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sourceParam = searchParams.get("source") ?? undefined;
  const source =
    sourceParam && isNewsletterSource(sourceParam) ? sourceParam : undefined;

  try {
    const rows = await adminListNewsletterSubscribers({ source });
    const csv = subscribersToCsv(rows);
    const filename = source
      ? `newsletter-leads-${source}.csv`
      : "newsletter-leads.csv";

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Falha ao exportar leads." },
      { status: 500 },
    );
  }
}
