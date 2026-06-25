import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/icons";
import { routes } from "@/lib/routes";

const guarantees = [
  {
    icon: "checklist" as const,
    title: "Conteúdo baseado em evidências",
    description:
      "Protocolos e materiais educativos — não substituem orientação médica individualizada.",
  },
  {
    icon: "star" as const,
    title: "Pagamento seguro",
    description:
      "Checkout via Mercado Pago com PIX, cartão ou boleto. Sem armazenar dados do cartão em nossos servidores.",
  },
  {
    icon: "community" as const,
    title: "Cancele quando quiser",
    description:
      "Plano mensal sem fidelidade. No anual, você mantém acesso até o fim do período pago.",
  },
] as const;

export function ClubTrustSection() {
  return (
    <Section background="white">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-heading text-3xl text-forest">Confiança e transparência</h2>
        <p className="mt-3 text-sm text-muted">
          Premium disponível agora — assinatura clara, sem surpresas.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {guarantees.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-surface p-6 text-center shadow-soft"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-muted text-sage">
              <Icon name={item.icon} size={22} aria-hidden />
            </span>
            <h3 className="mt-4 font-heading text-lg font-semibold text-forest">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button href={routes.assinar} variant="gold" size="md">
          Assinar Premium
        </Button>
        <Button href={`${routes.clube}#planos`} variant="outline" size="md">
          Comparar planos
        </Button>
      </div>
    </Section>
  );
}
