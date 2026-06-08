import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface LegalPageLayoutProps {
  badge: string;
  title: string;
  description: string;
  updatedAt: string;
  children: ReactNode;
}

export function LegalPageLayout({
  badge,
  title,
  description,
  updatedAt,
  children,
}: LegalPageLayoutProps) {
  return (
    <>
      <PageHero badge={badge} title={title} description={description} />
      <Container size="md" className="py-12 md:py-16">
        <p className="text-sm text-muted">Última atualização: {updatedAt}</p>
        <article
          className={cn(
            "prose-legal mt-10 space-y-10 text-graphite",
            "[&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-forest md:[&_h2]:text-2xl",
            "[&_h3]:font-heading [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-forest",
            "[&_p]:leading-relaxed [&_p]:text-muted",
            "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-muted",
            "[&_a]:text-sage [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-forest",
          )}
        >
          {children}
        </article>
      </Container>
    </>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2>{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
