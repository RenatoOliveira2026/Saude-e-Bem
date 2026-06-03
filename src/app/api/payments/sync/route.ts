import { syncPaymentByReference } from "@/lib/payments/mercadopago/webhook";
import { getCurrentUser } from "@/lib/auth/session";
import { createPaymentsAdminClient } from "@/lib/payments/admin-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let externalReference: string | undefined;
  try {
    const body = await request.json();
    externalReference = body?.externalReference;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (!externalReference?.trim()) {
    return NextResponse.json(
      { error: "externalReference obrigatório." },
      { status: 400 },
    );
  }

  const admin = createPaymentsAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Serviço de pagamentos indisponível." },
      { status: 503 },
    );
  }

  const { data: payment } = await admin
    .from("payments")
    .select("user_id")
    .eq("external_reference", externalReference)
    .maybeSingle();

  if (!payment || payment.user_id !== user.id) {
    return NextResponse.json(
      { error: "Pagamento não encontrado." },
      { status: 404 },
    );
  }

  try {
    const result = await syncPaymentByReference(externalReference);
    return NextResponse.json(result, { status: result.ok ? 200 : 202 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao sincronizar pagamento.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
