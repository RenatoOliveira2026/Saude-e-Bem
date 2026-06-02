import { Icon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("py-4", className)}>
      <Container>
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-2">
                {index > 0 && (
                  <Icon
                    name="chevron-right"
                    size={14}
                    className="text-muted-light"
                  />
                )}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-muted transition-colors hover:text-forest"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      isLast ? "font-medium text-forest" : "text-muted",
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
