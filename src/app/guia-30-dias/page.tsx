import { NewsletterCaptureForm } from "@/components/newsletter/NewsletterCaptureForm";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/icons";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";

const GUIDE_TITLE =
  "Guia Gratuito: 10 Hábitos para Melhorar Sua Saúde em 30 Dias";

const HABITS = [
  "Hidratação consciente ao longo do dia",
  "Rotina de sono com horários consistentes",
  "Movimento diário acessível (caminhada ou alongamento)",
  "Alimentação com mais vegetais e proteínas de qualidade",
  "Pausas para respiração e redução de estresse",
  "Exposição moderada à luz natural pela manhã",
  "Limites saudáveis para telas antes de dormir",
  "Conexão social e momentos de gratidão",
  "Organização semanal de refeições e rotinas",
  "Revisão semanal do que funcionou — ajuste fino contínuo",
];

export const metadata = buildContentMetadata({
  title: GUIDE_TITLE,
  description:
    "Baixe o guia gratuito com 10 hábitos práticos para melhorar sua saúde, energia e bem-estar em 30 dias — passo a passo aplicável.",
  path: routes.guia30Dias,
});

export default function Guia30DiasPage() {
  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-sage-muted via-off-white to-gold-muted/20 py-14 md:py-20">
        <Container size="md">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge variant="gold" className="mb-4">
                Guia gratuito
              </Badge>
              <h1 className="font-heading text-3xl leading-snug text-forest text-balance md:text-4xl">
                {GUIDE_TITLE}
              </h1>
              <p className="mt-5 text-muted leading-relaxed text-pretty">
                Um plano simples e estruturado para transformar pequenas ações em
                resultados reais — sem promessas milagrosas, com foco em
                consistência e qualidade de vida.
              </p>
              <ul className="mt-8 space-y-3">
                {HABITS.slice(0, 5).map((habit) => (
                  <li
                    key={habit}
                    className="flex items-start gap-3 text-sm text-forest"
                  >
                    <Icon
                      name="checklist"
                      size={18}
                      className="mt-0.5 shrink-0 text-sage"
                    />
                    {habit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <p className="font-heading text-xs uppercase tracking-[0.2em] text-sage">
                Acesso imediato
              </p>
              <h2 className="mt-3 font-heading text-xl font-semibold text-forest text-balance">
                Receba o guia no seu e-mail
              </h2>
              <p className="mt-2 text-sm text-muted">
                Preencha abaixo e enviaremos o material completo com os 10 hábitos
                e um plano de 30 dias.
              </p>
              <div className="mt-6">
                <NewsletterCaptureForm
                  source="guia-30-dias"
                  variant="light"
                  showPhone
                  submitLabel="Baixar guia gratuito"
                  conversionEvent="lead_magnet_download"
                />
              </div>
              <p className="mt-4 text-xs text-muted-light">
                Respeitamos sua privacidade. Sem spam.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section background="white">
        <Container size="md">
          <h2 className="font-heading text-2xl text-forest">
            Os 10 hábitos do guia
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {HABITS.map((habit, index) => (
              <li
                key={habit}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-5 text-sm text-muted shadow-soft"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-muted font-heading text-xs font-semibold text-forest">
                  {index + 1}
                </span>
                {habit}
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
