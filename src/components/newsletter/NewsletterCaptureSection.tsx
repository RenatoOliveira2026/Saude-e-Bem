import { NewsletterCaptureForm } from "@/components/newsletter/NewsletterCaptureForm";
import { Section, SectionTitle } from "@/components/ui/Section";
import type { NewsletterSource } from "@/lib/newsletter/types";

type SectionVariant = "forest" | "light";

export const GLOBAL_NEWSLETTER_CTA =
  "Receba conteúdos exclusivos sobre saúde, bem-estar e qualidade de vida.";

export const GLOBAL_NEWSLETTER_SUBTITLE =
  "Cadastre-se gratuitamente e receba materiais práticos no seu e-mail.";

interface NewsletterCaptureSectionProps {
  source: NewsletterSource;
  variant?: SectionVariant;
  title?: string;
  description?: string;
  id?: string;
  useGlobalCopy?: boolean;
}

const defaults: Record<
  NewsletterSource,
  { title: string; description: string; variant: SectionVariant }
> = {
  home: {
    title: GLOBAL_NEWSLETTER_CTA,
    description: GLOBAL_NEWSLETTER_SUBTITLE,
    variant: "forest",
  },
  blog: {
    title: GLOBAL_NEWSLETTER_CTA,
    description: GLOBAL_NEWSLETTER_SUBTITLE,
    variant: "light",
  },
  biblioteca: {
    title: GLOBAL_NEWSLETTER_CTA,
    description: GLOBAL_NEWSLETTER_SUBTITLE,
    variant: "light",
  },
  protocolos: {
    title: GLOBAL_NEWSLETTER_CTA,
    description: GLOBAL_NEWSLETTER_SUBTITLE,
    variant: "light",
  },
  footer: {
    title: GLOBAL_NEWSLETTER_CTA,
    description: GLOBAL_NEWSLETTER_SUBTITLE,
    variant: "forest",
  },
  popup: {
    title: GLOBAL_NEWSLETTER_CTA,
    description: GLOBAL_NEWSLETTER_SUBTITLE,
    variant: "light",
  },
  "guia-30-dias": {
    title: GLOBAL_NEWSLETTER_CTA,
    description: GLOBAL_NEWSLETTER_SUBTITLE,
    variant: "forest",
  },
  clube: {
    title: "Fique por dentro do Clube Saúde & Bem",
    description: "Cadastre-se para receber novidades e acesso antecipado.",
    variant: "light",
  },
  other: {
    title: GLOBAL_NEWSLETTER_CTA,
    description: GLOBAL_NEWSLETTER_SUBTITLE,
    variant: "light",
  },
};

export function NewsletterCaptureSection({
  source,
  variant,
  title,
  description,
  id = "newsletter",
  useGlobalCopy = true,
}: NewsletterCaptureSectionProps) {
  const preset = defaults[source];
  const resolvedVariant = variant ?? preset.variant;
  const isForest = resolvedVariant === "forest";
  const resolvedTitle =
    title ?? (useGlobalCopy ? GLOBAL_NEWSLETTER_CTA : preset.title);
  const resolvedDescription =
    description ?? (useGlobalCopy ? GLOBAL_NEWSLETTER_SUBTITLE : preset.description);

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
          className={`mt-4 text-2xl text-balance md:text-3xl ${
            isForest ? "text-off-white" : ""
          }`}
        >
          {resolvedTitle}
        </SectionTitle>
        <p
          className={`mt-4 leading-relaxed text-pretty ${
            isForest ? "text-off-white/70" : "text-muted"
          }`}
        >
          {resolvedDescription}
        </p>

        <div className="mt-10 sm:mx-auto sm:max-w-md">
          <NewsletterCaptureForm source={source} variant={resolvedVariant} />
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

/** Alias semântico — Fase 5.2 newsletter global */
export function GlobalNewsletterSection(
  props: Omit<NewsletterCaptureSectionProps, "useGlobalCopy">,
) {
  return <NewsletterCaptureSection {...props} useGlobalCopy />;
}
