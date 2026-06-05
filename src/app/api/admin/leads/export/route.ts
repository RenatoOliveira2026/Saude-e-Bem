import { adminListLeads, leadsToCsv } from "@/lib/admin/services/leads.service";
import { getAdminSession } from "@/lib/admin/session";
import { LEAD_SCORE_ORDER, type LeadScoreId } from "@/lib/leads/lead-score";
import { LEAD_SOURCE_LABELS } from "@/lib/leads/lead.constants";
import type { LeadSource } from "@/lib/leads/lead.types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sourceParam = searchParams.get("source") ?? undefined;
  const scoreParam = searchParams.get("score") ?? undefined;
  const interestParam = searchParams.get("interest") ?? undefined;

  const source =
    sourceParam && sourceParam in LEAD_SOURCE_LABELS
      ? (sourceParam as LeadSource)
      : undefined;
  const score =
    scoreParam && LEAD_SCORE_ORDER.includes(scoreParam as LeadScoreId)
      ? (scoreParam as LeadScoreId)
      : undefined;

  try {
    const rows = await adminListLeads({
      source,
      score,
      interest: interestParam,
    });
    const csv = leadsToCsv(rows);
    const filename = "leads-conversao.csv";

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Falha ao exportar leads." }, { status: 500 });
  }
}
