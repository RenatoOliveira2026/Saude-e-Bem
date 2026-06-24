import { adminRoutes } from "@/lib/routes";
import Link from "next/link";

const checklistItems = [
  {
    title: "Verificar novos usuários",
    description: "Cadastros das últimas 24h, e-mail confirmado e perfil billing.",
    href: adminRoutes.usuarios,
  },
  {
    title: "Verificar pagamentos",
    description: "PIX pendentes há mais de 2h e pagamentos rejeitados no Financeiro.",
    href: adminRoutes.financeiro,
  },
  {
    title: "Verificar Premium ativo",
    description: "Assinaturas e memberships com status active e data de expiração.",
    href: adminRoutes.memberships,
  },
  {
    title: "Verificar recuperação de senha",
    description: "Teste /recuperar-senha e confirme redirect para /auth/verify.",
    href: "/recuperar-senha",
  },
  {
    title: "Verificar webhooks Mercado Pago",
    description: "Eventos com alerta nas últimas 24h e endpoint 200 (sem 401).",
    href: adminRoutes.financeiro,
  },
] as const;

export function LaunchDailyChecklist() {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <h2 className="font-heading text-lg font-semibold text-forest">
        Checklist operacional diário
      </h2>
      <p className="mt-1 text-sm text-muted">
        Rotina recomendada nos primeiros dias após o lançamento.
      </p>
      <ol className="mt-5 space-y-4">
        {checklistItems.map((item, index) => (
          <li
            key={item.title}
            className="flex gap-4 rounded-xl border border-border bg-off-white p-4"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/15 font-heading text-sm font-semibold text-forest">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-forest">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.description}</p>
              <Link
                href={item.href}
                className="mt-2 inline-block text-sm text-sage hover:underline"
              >
                Abrir →
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
