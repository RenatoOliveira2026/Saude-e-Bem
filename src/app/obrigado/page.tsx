import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/icons";
import {
  NEWSLETTER_SOURCE_LABELS,
  parseNewsletterSource,
} from "@/lib/newsletter/sources";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inscrição confirmada",
  description: "Obrigado por se inscrever na newsletter Saúde & Bem.",
  robots: { index: false, follow: false },
};

interface ObrigadoPageProps {
  searchParams: Promise<{ source?: string; existing?: string }>;
}

export default async function ObrigadoPage({ searchParams }: ObrigadoPageProps) {
  const params = await searchParams;
  const existing = params.existing === "1";
  const sourceKey = parseNewsletterSource(params.source ?? "home");
  const sourceLabel = NEWSLETTER_SOURCE_LABELS[sourceKey];

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-muted">
        <Icon name="checklist" className="h-8 w-8 text-forest" />
      </div>
      <h1 className="mt-8 font-heading text-3xl font-semibold text-forest text-balance md:text-4xl">
        {existing ? "Você já está inscrito!" : "Obrigado por se inscrever!"}
      </h1>
      <p className="mt-4 max-w-lg text-muted leading-relaxed text-pretty">
        {existing
          ? "Este e-mail já faz parte da nossa lista. Em breve você continuará recebendo nossos melhores conteúdos."
          : "Sua inscrição foi registrada com sucesso. Em breve você receberá artigos, protocolos e insights práticos no seu e-mail."}
      </p>
      <p className="mt-2 text-sm text-muted-light">
        Origem: {sourceLabel}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button href={routes.home} variant="primary" size="md">
          Voltar ao início
        </Button>
        <Button href={routes.blog} variant="outline" size="md">
          Ler o blog
        </Button>
      </div>
      <p className="mt-8 text-xs text-muted-light">
        Dúvidas?{" "}
        <Link href={routes.clube} className="text-forest underline-offset-2 hover:underline">
          Conheça o Clube Saúde & Bem
        </Link>
      </p>
    </Container>
  );
}
