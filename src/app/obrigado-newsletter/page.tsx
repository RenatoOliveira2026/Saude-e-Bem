import { NewsletterConversionTracker } from "@/components/newsletter/NewsletterConversionTracker";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/icons";
import {
  NEWSLETTER_SOURCE_LABELS,
  parseNewsletterSource,
} from "@/lib/newsletter/sources";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro realizado",
  description: "Cadastro realizado com sucesso no Saúde & Bem.",
  robots: { index: false, follow: false },
};

interface ObrigadoNewsletterPageProps {
  searchParams: Promise<{
    source?: string;
    event?: string;
    existing?: string;
  }>;
}

export default async function ObrigadoNewsletterPage({
  searchParams,
}: ObrigadoNewsletterPageProps) {
  const params = await searchParams;
  const existing = params.existing === "1";
  const sourceKey = parseNewsletterSource(params.source ?? "home");
  const sourceLabel = NEWSLETTER_SOURCE_LABELS[sourceKey];

  const heading = existing
    ? "Você já está inscrito"
    : "Cadastro realizado com sucesso.";

  const description = existing
    ? "Este e-mail já está na nossa lista. Em breve você continuará recebendo conteúdos exclusivos."
    : "Em breve você receberá materiais práticos sobre saúde, bem-estar e qualidade de vida no seu e-mail.";

  return (
    <>
      <NewsletterConversionTracker
        source={params.source}
        event={params.event}
        existing={existing}
      />
      <Container className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-muted">
          <Icon name="checklist" className="h-8 w-8 text-forest" />
        </div>
        <h1 className="mt-8 max-w-xl font-heading text-3xl font-semibold leading-snug text-forest text-pretty md:text-4xl">
          {heading}
        </h1>
        <p className="mt-4 max-w-lg text-muted leading-relaxed text-pretty">
          {description}
        </p>
        <p className="mt-2 text-sm text-muted-light">Origem: {sourceLabel}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href={routes.blog} variant="primary" size="md">
            Explorar blog
          </Button>
          <Button href={routes.protocolos} variant="outline" size="md">
            Ver protocolos
          </Button>
          <Button href={routes.biblioteca} variant="outline" size="md">
            Biblioteca
          </Button>
        </div>
      </Container>
    </>
  );
}
