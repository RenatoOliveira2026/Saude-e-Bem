import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

interface PageHeroProps {
  badge?: string;
  title: string;
  description: string;
  className?: string;
  /** Limita largura do bloco de texto (padrão páginas internas). */
  narrow?: boolean;
}

export function PageHero({
  badge,
  title,
  description,
  className,
  narrow = true,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "border-b border-border bg-surface pt-10 pb-14 md:pt-14 md:pb-16",
        className,
      )}
    >
      <Container size="md" className="min-w-0">
        <div className={cn(narrow && "max-w-3xl")}>
          {badge && (
            <Badge variant="gold" className="mb-4 md:mb-5">
              {badge}
            </Badge>
          )}
          <h1 className="font-heading text-3xl leading-snug text-forest text-pretty sm:text-4xl md:leading-tight">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted text-pretty md:mt-5 md:text-lg">
            {description}
          </p>
        </div>
        <div className={cn("divider-gold mt-8 md:mt-10", narrow && "max-w-3xl")} />
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
