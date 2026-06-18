import { LeadCaptureForm } from "@/components/leads/LeadCaptureForm";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/icons";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";

const CHECKLIST_ITEMS = [
  "Beber água ao acordar e ao longo do dia",
  "Dormir e acordar em horários regulares",
  "Mover o corpo por pelo menos 20 minutos",
  "Incluir vegetais e proteína em cada refeição principal",
  "Fazer pausas de respiração ou alongamento",
  "Limitar telas 1h antes de dormir",
  "Expor-se à luz natural pela manhã",
  "Planejar refeições da semana com antecedência",
  "Registrar energia e sono 1x por semana",
  "Celebrar pequenas vitórias — consistência importa",
];

export const metadata = buildContentMetadata({
  title: "Checklist de Hábitos Saudáveis — Material gratuito",
  description:
    "Baixe o checklist gratuito de hábitos saudáveis e revise sua rotina diária com passos simples e aplicáveis.",
  path: routes.checklistHabitos,
});

export default function ChecklistHabitosPage() {
  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-sage-muted via-off-white to-gold-muted/20 py-14 md:py-20">
        <Container size="md">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge variant="gold" className="mb-4">
                Material gratuito
              </Badge>
              <h1 className="font-heading text-3xl leading-snug text-forest text-balance md:text-4xl">
                Checklist de Hábitos Saudáveis
              </h1>
              <p className="mt-5 text-muted leading-relaxed text-pretty">
                Uma lista objetiva para revisar sua rotina, identificar quick wins e
                construir consistência — sem complicar.
              </p>
              <ul className="mt-8 space-y-3">
                {CHECKLIST_ITEMS.slice(0, 5).map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-forest">
                    <Icon
                      name="checklist"
                      size={18}
                      className="mt-0.5 shrink-0 text-sage"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <p className="font-heading text-xs uppercase tracking-[0.2em] text-sage">
                Acesso imediato
              </p>
              <h2 className="mt-3 font-heading text-xl font-semibold text-forest text-balance">
                Receba o checklist no seu e-mail
              </h2>
              <p className="mt-2 text-sm text-muted">
                Cadastre-se e enviaremos o checklist completo com os 10 hábitos para
                revisar sua semana.
              </p>
              <div className="mt-6">
                <LeadCaptureForm
                  source="lista-vip-lancamento"
                  variant="light"
                  submitLabel="Baixar checklist gratuito"
                  defaultInterest="bem-estar-geral"
                  hideInterestSelect
                  showWhatsAppFields={false}
                  contentType="lead_magnet"
                  contentSlug="checklist-habitos"
                  contentTitle="Checklist de Hábitos Saudáveis"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section background="white">
        <Container size="md">
          <h2 className="font-heading text-2xl text-forest">Os 10 hábitos do checklist</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {CHECKLIST_ITEMS.map((item, index) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-5 text-sm text-muted shadow-soft"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-muted font-heading text-xs font-semibold text-forest">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
