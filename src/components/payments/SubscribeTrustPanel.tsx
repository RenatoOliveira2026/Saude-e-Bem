import { Icon } from "@/components/icons";
import { routes } from "@/lib/routes";

const steps = [
  {
    title: "1. Escolha o plano e pague",
    description: "PIX, cartão ou boleto via Mercado Pago — ambiente seguro e criptografado.",
  },
  {
    title: "2. Confirmação automática",
    description:
      "Assim que o pagamento é aprovado, sua assinatura Premium é ativada no sistema.",
  },
  {
    title: "3. Acesso imediato ao Clube",
    description:
      "Entre em Minha Assinatura ou vá direto ao Clube Premium para usar protocolos e ferramentas exclusivas.",
  },
] as const;

const trustItems = [
  "Pagamento processado pelo Mercado Pago",
  "Dados protegidos — sem armazenar cartão",
  "Premium ativo logo após aprovação (PIX em minutos)",
  "Cancele o mensal quando quiser",
] as const;

export function SubscribeTrustPanel() {
  return (
    <div className="mb-8 space-y-6">
      <div className="rounded-2xl border border-sage/30 bg-sage-muted/25 p-5">
        <h2 className="font-heading text-lg font-semibold text-forest">
          Acesso imediato ao Premium
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Após a confirmação do pagamento, você desbloqueia protocolos exclusivos,
          ferramentas avançadas e a área de membros do Clube — sem espera manual.
        </p>
        <ol className="mt-5 space-y-4">
          {steps.map((step) => (
            <li key={step.title} className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage">
                <Icon name="checklist" size={16} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-medium text-forest">{step.title}</p>
                <p className="mt-1 text-sm text-muted">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {trustItems.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-graphite"
          >
            <span className="text-sage" aria-hidden="true">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      <p className="text-center text-xs text-muted-light">
        Dúvidas após pagar? Acompanhe em{" "}
        <a href={routes.minhaAssinatura} className="text-sage hover:underline">
          Minha Assinatura
        </a>
        .
      </p>
    </div>
  );
}
