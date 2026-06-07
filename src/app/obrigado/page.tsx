import { ThankYouRecommendations } from "@/components/conversion/ThankYouRecommendations";
import { WhatsAppCaptureSection } from "@/components/whatsapp";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/icons";
import {
  getLeadInterestLabel,
  LEAD_MESSAGES,
  LEAD_SOURCE_LABELS,
  parseLeadSource,
} from "@/lib/leads";
import {
  LEAD_SCORE_LABELS,
  type LeadScoreId,
} from "@/lib/leads/lead-score";
import {
  NEWSLETTER_SOURCE_LABELS,
  parseNewsletterSource,
} from "@/lib/newsletter/sources";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cadastro confirmado",
  description: "Obrigado por se cadastrar no Saúde & Bem.",
  robots: { index: false, follow: false },
};

interface ObrigadoPageProps {
  searchParams: Promise<{
    source?: string;
    existing?: string;
    type?: string;
    interest?: string;
    score?: string;
  }>;
}

export default async function ObrigadoPage({ searchParams }: ObrigadoPageProps) {
  const params = await searchParams;
  const existing = params.existing === "1";
  const isLeadFlow = params.type === "lead";
  const sourceKey = isLeadFlow
    ? parseLeadSource(params.source ?? "home")
    : parseNewsletterSource(params.source ?? "home");
  const sourceLabel = isLeadFlow
    ? LEAD_SOURCE_LABELS[sourceKey as keyof typeof LEAD_SOURCE_LABELS]
    : NEWSLETTER_SOURCE_LABELS[sourceKey as keyof typeof NEWSLETTER_SOURCE_LABELS];
  const interestLabel = params.interest
    ? getLeadInterestLabel(params.interest)
    : null;
  const scoreLabel =
    params.score && params.score in LEAD_SCORE_LABELS
      ? LEAD_SCORE_LABELS[params.score as LeadScoreId]
      : null;

  const heading = existing ? LEAD_MESSAGES.existing : LEAD_MESSAGES.success;

  const description = existing
    ? "Este e-mail já está na nossa base. Em breve você continuará recebendo conteúdos alinhados ao seu interesse."
    : "Seu cadastro foi registrado. Em breve você receberá materiais práticos no seu e-mail.";

  return (
    <>
      <Container className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-muted">
          <Icon name="checklist" className="h-8 w-8 text-forest" />
        </div>
        <h1 className="mt-8 max-w-xl font-heading text-3xl font-semibold leading-snug text-forest text-pretty md:text-4xl">
          {heading}
        </h1>
        <p className="mt-4 max-w-lg text-muted leading-relaxed text-pretty">{description}</p>
        <p className="mt-2 text-sm text-muted-light">
          Origem: {sourceLabel}
          {interestLabel ? ` · Interesse: ${interestLabel}` : ""}
          {scoreLabel ? ` · Score: ${scoreLabel}` : ""}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href={routes.home} variant="primary" size="md">
            Voltar ao início
          </Button>
          <Button href={routes.biblioteca} variant="outline" size="md">
            Explorar biblioteca
          </Button>
        </div>
        <p className="mt-8 text-xs text-muted-light">
          Conheça o{" "}
          <Link href={routes.assinar} className="text-forest underline-offset-2 hover:underline">
            Clube Premium
          </Link>
        </p>
        {isLeadFlow && (
          <div className="mt-10 w-full max-w-lg">
            <WhatsAppCaptureSection
              title="Continue pelo WhatsApp"
              description="Tire dúvidas ou receba conteúdos exclusivos no WhatsApp."
              message="Olá! Acabei de me cadastrar no Saúde & Bem."
            />
          </div>
        )}
      </Container>

      {isLeadFlow && <ThankYouRecommendations interest={params.interest} />}
    </>
  );
}
