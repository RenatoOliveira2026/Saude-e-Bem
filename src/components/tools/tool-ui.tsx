"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";
import type { ReactNode } from "react";

export function ToolFieldset({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <legend className="px-1 font-heading text-lg font-semibold text-forest">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export function ToolResultPanel({
  badge,
  subtitle,
  children,
  recommendations,
  resultId = "resultado-ferramenta",
}: {
  badge?: string;
  subtitle?: string;
  children: ReactNode;
  recommendations?: string[];
  resultId?: string;
}) {
  return (
    <div
      id={resultId}
      className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8"
      role="status"
      aria-live="polite"
    >
      <p className="font-heading text-sm font-semibold uppercase tracking-wider text-muted">
        Seu resultado
      </p>
      {(badge || subtitle) && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {badge && (
            <Badge variant="sage" className="text-sm">
              {badge}
            </Badge>
          )}
          {subtitle && <span className="text-sm text-muted">{subtitle}</span>}
        </div>
      )}
      <div className="mt-6">{children}</div>
      {recommendations && recommendations.length > 0 && (
        <div className="mt-6">
          <h3 className="font-heading text-sm font-semibold text-forest">
            Orientações
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {recommendations.map((r) => (
              <li key={r} className="text-pretty">
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ToolResultActions />
    </div>
  );
}

export function ToolResultActions() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button href={routes.protocolos} variant="primary" size="md">
        Ver protocolos
      </Button>
      <Button href={routes.ferramentas} variant="outline" size="md">
        Outras ferramentas
      </Button>
    </div>
  );
}

export function ToolDisclaimer({ children }: { children?: ReactNode }) {
  return (
    <p className="max-w-md text-xs text-muted">
      {children ??
        "Ferramenta educativa. Não substitui avaliação médica ou nutricional individualizada."}
    </p>
  );
}

export function scrollToResult(id = "resultado-ferramenta") {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
