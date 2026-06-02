import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

interface PageHeroProps {
  badge?: string;
  title: string;
  description: string;
  className?: string;
}

export function PageHero({
  badge,
  title,
  description,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "border-b border-border bg-surface pt-12 pb-16 md:pt-16 md:pb-20",
        className,
      )}
    >
      <Container size="md">
        {badge && (
          <Badge variant="gold" className="mb-6">
            {badge}
          </Badge>
        )}
        <h1 className="font-heading text-4xl text-forest text-balance md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted text-pretty">
          {description}
        </p>
        <div className="divider-gold mt-8" />
      </Container>
    </section>
  );
}

interface ComingSoonProps {
  message?: string;
}

export function ComingSoon({
  message = "Esta seção está em desenvolvimento. Em breve você terá acesso a conteúdo exclusivo.",
}: ComingSoonProps) {
  return (
    <Container className="py-20 md:py-28">
      <div className="mx-auto max-w-lg rounded-xl border border-dashed border-border-strong bg-sage-muted/50 px-8 py-16 text-center">
        <p className="font-heading text-sm font-semibold uppercase tracking-widest text-sage">
          Em breve
        </p>
        <p className="mt-4 text-muted leading-relaxed">{message}</p>
      </div>
    </Container>
  );
}
