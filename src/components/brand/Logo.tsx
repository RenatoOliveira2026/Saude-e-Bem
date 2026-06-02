"use client";

import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  LOGO_ALT,
  logoContextClasses,
  OFFICIAL_LOGO_INTRINSIC_HEIGHT,
  OFFICIAL_LOGO_INTRINSIC_WIDTH,
  OFFICIAL_LOGO_PNG,
  type LogoContext,
} from "./logo-config";
import { LogoMark } from "./LogoMark";

/* -------------------------------------------------------------------------- */
/*  LogoImage — componente base (PNG oficial + fallback SVG)                  */
/* -------------------------------------------------------------------------- */

interface LogoImageProps {
  context?: LogoContext;
  /** Pill claro sobre fundos escuros — preserva cores do PNG */
  onDark?: boolean;
  className?: string;
  priority?: boolean;
}

function LogoImage({
  context = "header",
  onDark = false,
  className,
  priority = false,
}: LogoImageProps) {
  const [imgError, setImgError] = useState(false);

  const content = imgError ? (
    <LogoFallback context={context} />
  ) : (
    <Image
      src={OFFICIAL_LOGO_PNG}
      alt={LOGO_ALT}
      width={OFFICIAL_LOGO_INTRINSIC_WIDTH}
      height={OFFICIAL_LOGO_INTRINSIC_HEIGHT}
      onError={() => setImgError(true)}
      priority={priority}
      className={cn(
        "object-contain object-left",
        logoContextClasses[context],
        className,
      )}
      sizes="(max-width: 640px) 168px, (max-width: 768px) 200px, 280px"
    />
  );

  if (onDark) {
    return (
      <span className="inline-flex items-center rounded-lg bg-off-white px-3 py-1.5 shadow-soft">
        {content}
      </span>
    );
  }

  return content;
}

function LogoFallback({ context }: { context: LogoContext }) {
  const markSize = context === "auth" ? 48 : context === "footer" ? 40 : 32;

  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark size={markSize} variant="dark" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading font-bold tracking-tight text-forest",
            context === "auth" ? "text-xl" : "text-base",
          )}
        >
          Saúde & Bem
        </span>
        <span
          className={cn(
            "mt-0.5 font-medium uppercase tracking-[0.18em] text-sage",
            context === "auth" ? "text-[0.65rem]" : "text-[0.6rem]",
          )}
        >
          Longevidade & Vitalidade
        </span>
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Variantes oficiais                                                        */
/* -------------------------------------------------------------------------- */

interface LogoLinkProps {
  className?: string;
  priority?: boolean;
  /** Destino do link. Use `null` para renderizar sem link (evita `<a>` aninhado). */
  href?: string | null;
}

/** Header — navegação principal */
export function LogoHeader({
  className,
  inverted = false,
  priority = true,
  href = routes.home,
}: LogoLinkProps & { inverted?: boolean }) {
  const image = (
    <LogoImage
      context="header"
      onDark={inverted}
      priority={priority}
      className="transition-transform duration-200 group-hover:scale-[1.02]"
    />
  );

  if (href === null) {
    return (
      <span
        className={cn("group inline-flex shrink-0 items-center", className)}
        aria-hidden
      >
        {image}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex shrink-0 items-center transition-opacity hover:opacity-90",
        className,
      )}
      aria-label="Saúde & Bem — Página inicial"
    >
      {image}
    </Link>
  );
}

/** Footer — fundo Verde Floresta */
export function LogoFooter({ className }: LogoLinkProps) {
  return (
    <Link
      href={routes.home}
      className={cn(
        "group inline-flex items-center transition-opacity hover:opacity-90",
        className,
      )}
      aria-label="Saúde & Bem — Página inicial"
    >
      <LogoImage
        context="footer"
        onDark
        className="transition-transform duration-200 group-hover:scale-[1.02]"
      />
    </Link>
  );
}

/** Auth — login, cadastro, recuperação de senha */
export function LogoAuth({ className, priority = true }: LogoLinkProps) {
  return (
    <Link
      href={routes.home}
      className={cn(
        "mx-auto inline-flex justify-center transition-opacity hover:opacity-90",
        className,
      )}
      aria-label="Saúde & Bem — Página inicial"
    >
      <LogoImage context="auth" priority={priority} />
    </Link>
  );
}

/** @deprecated Use LogoHeader com inverted ou LogoFooter */
export function Logo({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "light";
}) {
  return (
    <LogoHeader className={className} inverted={variant === "light"} />
  );
}

export { LogoImage };
