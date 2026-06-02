import { NewsletterCaptureForm } from "@/components/newsletter/NewsletterCaptureForm";
import { Section, SectionTitle } from "@/components/ui/Section";
import type { NewsletterSource } from "@/lib/newsletter/types";

type SectionVariant = "forest" | "light";

interface NewsletterCaptureSectionProps {
  source: NewsletterSource;
  variant?: SectionVariant;
  title?: string;
  description?: string;
  id?: string;
}

const defaults: Record<
  NewsletterSource,
  { title: string; description: string; variant: SectionVariant }
> = {
  home: {
    title: "Receba conteúdos exclusivos sobre saúde, hábitos e longevidade",
    description:
      "Uma curadoria mensal com artigos, protocolos e insights práticos — sem spam, apenas valor.",
    variant: "forest",
  },
  blog: {
    title: "Não perca os próximos artigos",
    description:
      "Receba no seu e-mail os melhores conteúdos sobre longevidade, sono, nutrição e bem-estar.",
    variant: "light",
  },
  biblioteca: {
    title: "Novos materiais direto no seu e-mail",
    description:
      "Seja avisado quando publicarmos guias, checklists e estudos na biblioteca gratuita.",
    variant: "light",
  },
  clube: {
    title: "Fique por dentro do Clube Saúde & Bem",
    description: "Cadastre-se para receber novidades e acesso antecipado.",
    variant: "light",
  },
  other: {
    title: "Assine nossa newsletter",
    description: "Conteúdo de saúde e longevidade, sem spam.",
    variant: "light",
  },
};

export function NewsletterCaptureSection({
  source,
  variant,
  title,
  description,
  id = "newsletter",
}: NewsletterCaptureSectionProps) {
  const preset = defaults[source];
  const resolvedVariant = variant ?? preset.variant;
  const isForest = resolvedVariant === "forest";

  return (
    <Section
      background={isForest ? "forest" : "sage"}
      id={id}
      spacing={isForest ? "spacious" : "compact"}
    >
      <div className="mx-auto max-w-2xl text-center">
        <p
          className={`font-heading text-xs font-semibold uppercase tracking-[0.2em] ${
            isForest ? "text-gold/90" : "text-sage"
          }`}
        >
          Newsletter
        </p>
        <SectionTitle
          className={`mt-4 text-2xl md:text-3xl text-balance ${
            isForest ? "text-off-white" : ""
          }`}
        >
          {title ?? preset.title}
        </SectionTitle>
        <p
          className={`mt-4 leading-relaxed text-pretty ${
            isForest ? "text-off-white/70" : "text-muted"
          }`}
        >
          {description ?? preset.description}
        </p>

        <div className="mt-10 sm:mx-auto sm:max-w-md">
          <NewsletterCaptureForm
            source={source}
            variant={resolvedVariant}
          />
        </div>

        <p
          className={`mt-6 text-xs ${
            isForest ? "text-off-white/50" : "text-muted-light"
          }`}
        >
          Respeitamos sua privacidade. Cancele quando quiser.
        </p>
      </div>
    </Section>
  );
}
