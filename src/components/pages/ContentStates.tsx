import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { IconName } from "@/components/icons";

interface ContentEmptyStateProps {
  icon?: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function ContentEmptyState({
  icon = "leaf",
  title,
  description,
  actionLabel,
  actionHref,
}: ContentEmptyStateProps) {
  return (
    <Section background="white">
      <Container>
        <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-muted/40 text-sage">
            <Icon name={icon} className="h-8 w-8" aria-hidden />
          </div>
          <h2 className="mt-6 font-heading text-xl font-semibold text-forest">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>
          {actionLabel && actionHref && (
            <Button href={actionHref} variant="primary" className="mt-8">
              {actionLabel}
            </Button>
          )}
        </div>
      </Container>
    </Section>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-sage-muted/70 ${className ?? ""}`}
    />
  );
}

interface ContentListingLoadingProps {
  variant?: "blog" | "protocols" | "library";
}

interface ContentErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ContentErrorState({
  title = "Não foi possível carregar o conteúdo",
  description = "Ocorreu um problema temporário. Tente novamente em instantes.",
  onRetry,
}: ContentErrorStateProps) {
  return (
    <Section background="white">
      <Container>
        <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-muted/50 text-gold">
            <Icon name="activity" className="h-8 w-8" aria-hidden />
          </div>
          <h2 className="mt-6 font-heading text-xl font-semibold text-forest">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-8 rounded-full bg-forest px-6 py-2.5 font-heading text-sm font-semibold text-off-white transition hover:bg-sage"
            >
              Tentar novamente
            </button>
          )}
        </div>
      </Container>
    </Section>
  );
}

export function ContentListingLoading({
  variant = "blog",
}: ContentListingLoadingProps) {
  const bannerBg =
    variant === "library" ? "bg-gold-muted/30" : "bg-sage-muted/20";

  return (
    <>
      <section className="py-10 md:py-12">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-px)]">
          <Skeleton className={`h-48 w-full md:h-56 ${bannerBg}`} />
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-px)]">
          <Skeleton className="h-10 w-full max-w-xl" />
          <Skeleton className="mt-4 h-4 w-32" />
        </div>
        <div className="mx-auto mt-10 grid max-w-[var(--container-max)] gap-6 px-[var(--container-px)] sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </section>
    </>
  );
}
