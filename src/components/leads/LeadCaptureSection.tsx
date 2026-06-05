import { LeadCaptureForm } from "@/components/leads/LeadCaptureForm";
import { Section, SectionTitle } from "@/components/ui/Section";
import type { LeadInterestId, LeadSource } from "@/lib/leads/lead.types";

type SectionVariant = "forest" | "light";

interface LeadCaptureSectionProps {
  source: LeadSource;
  variant?: SectionVariant;
  title?: string;
  description?: string;
  id?: string;
  submitLabel?: string;
  defaultInterest?: LeadInterestId;
  hideInterestSelect?: boolean;
  contentType?: string;
  contentSlug?: string;
  contentTitle?: string;
  lpSlug?: string;
}

const defaults: Record<
  LeadSource,
  { title: string; description: string; variant: SectionVariant }
> = {
  home: {
    title: "Receba conteúdos sobre o que mais importa para você",
    description:
      "Informe seu interesse e receba artigos, protocolos e materiais alinhados à sua jornada de saúde.",
    variant: "forest",
  },
  blog: {
    title: "Artigos no seu e-mail, no tema certo",
    description:
      "Cadastre-se e receba conteúdos sobre longevidade, sono, nutrição e bem-estar.",
    variant: "light",
  },
  biblioteca: {
    title: "Novos materiais no seu interesse",
    description:
      "Seja avisado quando publicarmos guias, checklists e estudos na biblioteca.",
    variant: "light",
  },
  assinar: {
    title: "Ainda não assinou? Comece pelo conteúdo gratuito",
    description:
      "Deixe seu e-mail e interesse — enviamos materiais práticos enquanto você decide sobre o Premium.",
    variant: "light",
  },
  "minha-saude": {
    title: "Continue evoluindo com conteúdos personalizados",
    description:
      "Receba no e-mail materiais alinhados ao seu perfil de saúde e interesses.",
    variant: "light",
  },
  other: {
    title: "Fique por dentro do Saúde & Bem",
    description: "Conteúdo de saúde e longevidade, sem spam.",
    variant: "light",
  },
  "lp-hidratacao": {
    title: "Receba o guia de hidratação",
    description: "Material gratuito no seu e-mail.",
    variant: "forest",
  },
  "lp-emagrecimento": {
    title: "Plano prático no seu e-mail",
    description: "Emagrecimento sustentável, sem promessas vazias.",
    variant: "forest",
  },
  "lp-longevidade": {
    title: "Longevidade saudável na prática",
    description: "Conteúdos selecionados pela equipe Saúde & Bem.",
    variant: "forest",
  },
  "lp-sono": {
    title: "Guia de sono reparador",
    description: "Rotina noturna em passos simples.",
    variant: "forest",
  },
  artigo: {
    title: "Continue aprendendo por e-mail",
    description: "Receba artigos alinhados ao tema que você acabou de ler.",
    variant: "light",
  },
  protocolo: {
    title: "Acompanhe sua jornada por e-mail",
    description: "Materiais e lembretes para manter consistência no protocolo.",
    variant: "light",
  },
};

export function LeadCaptureSection({
  source,
  variant,
  title,
  description,
  id = "captura-leads",
  submitLabel,
  defaultInterest,
  hideInterestSelect,
  contentType,
  contentSlug,
  contentTitle,
  lpSlug,
}: LeadCaptureSectionProps) {
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
          Saúde & Bem
        </p>
        <SectionTitle
          className={`mt-4 text-2xl text-balance md:text-3xl ${
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
          <LeadCaptureForm
            source={source}
            variant={resolvedVariant}
            submitLabel={submitLabel}
            defaultInterest={defaultInterest}
            hideInterestSelect={hideInterestSelect}
            contentType={contentType}
            contentSlug={contentSlug}
            contentTitle={contentTitle}
            lpSlug={lpSlug}
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
