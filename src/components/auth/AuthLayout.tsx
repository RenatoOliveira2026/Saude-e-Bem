import { LogoAuth } from "@/components/brand/Logo";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import Link from "next/link";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthLayout({
  title,
  description,
  children,
  footer,
  className,
}: AuthLayoutProps) {
  return (
    <section
      className={cn(
        "relative border-b border-border bg-gradient-to-b from-sage-muted/70 via-off-white to-off-white py-12 md:py-20",
        className,
      )}
    >
      <div className="brand-accent-bar absolute inset-x-0 top-0" aria-hidden />
      <Container size="sm">
        <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
          <div className="flex w-full justify-center">
            <LogoAuth />
          </div>
          <h1 className="mt-8 font-heading text-3xl text-forest">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
        </div>

        <Card
          variant="default"
          padding="lg"
          className="mx-auto mt-10 max-w-md border-forest/10 shadow-card ring-1 ring-forest/5"
        >
          {children}
        </Card>

        {footer && (
          <p className="mx-auto mt-6 max-w-md text-center text-sm text-muted">
            {footer}
          </p>
        )}
      </Container>
    </section>
  );
}

export function AuthMessage({
  type,
  message,
}: {
  type: "error" | "success";
  message: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 rounded-xl px-4 py-3 text-sm",
        type === "error"
          ? "border border-red-200 bg-red-50 text-red-700"
          : "border border-sage/30 bg-sage-muted/50 text-forest",
      )}
      role="alert"
    >
      {message}
    </div>
  );
}

export function AuthLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-forest underline-offset-4 hover:text-sage hover:underline"
    >
      {children}
    </Link>
  );
}
