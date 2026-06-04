import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { ProtocolLibraryItem } from "@/lib/protocol-library/types";
import { ProtocolLibraryCard } from "./ProtocolLibraryCard";

interface ProtocolLibrarySectionProps {
  title: string;
  description?: string;
  items: ProtocolLibraryItem[];
  favoriteIds?: string[];
  isLoggedIn?: boolean;
  actionLabel?: string;
  actionHref?: string;
  background?: "default" | "white" | "sage";
}

export function ProtocolLibrarySection({
  title,
  description,
  items,
  favoriteIds = [],
  isLoggedIn = false,
  actionLabel,
  actionHref,
  background = "default",
}: ProtocolLibrarySectionProps) {
  if (items.length === 0) return null;

  const favoriteSet = new Set(favoriteIds);

  return (
    <Section background={background}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl text-forest">{title}</h2>
            {description && (
              <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
            )}
          </div>
          {actionLabel && actionHref && (
            <Button href={actionHref} variant="outline" size="sm">
              {actionLabel}
            </Button>
          )}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((protocol) => (
            <ProtocolLibraryCard
              key={protocol.id}
              protocol={protocol}
              compact
              showFavorite={isLoggedIn}
              favorited={favoriteSet.has(protocol.id)}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
