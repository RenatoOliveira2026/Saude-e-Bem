import {
  adminListAllPayments,
  adminPaymentsToCsv,
} from "@/lib/admin/services/finance.service";
import { getAdminSession } from "@/lib/admin/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const payments = await adminListAllPayments(1000);
    const csv = adminPaymentsToCsv(payments);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="pagamentos.csv"',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao exportar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
