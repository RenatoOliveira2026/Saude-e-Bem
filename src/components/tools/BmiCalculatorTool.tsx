"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { evaluateBmi, parseBmiForm, type BmiResult } from "@/lib/tools/bmi";
import { useState } from "react";
import { ToolDisclaimer, ToolFieldset, ToolResultPanel, scrollToResult } from "./tool-ui";

export function BmiCalculatorTool() {
  const [result, setResult] = useState<BmiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const parsed = parseBmiForm(new FormData(e.currentTarget));
    if ("error" in parsed) {
      setError(parsed.error);
      setResult(null);
      return;
    }
    setResult(evaluateBmi(parsed.weightKg, parsed.heightCm));
    scrollToResult();
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <ToolFieldset title="Medidas">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              name="weightKg"
              type="number"
              label="Peso (kg)"
              min={35}
              max={250}
              step="0.1"
              required
              defaultValue={70}
            />
            <Input
              name="heightCm"
              type="number"
              label="Altura (cm)"
              min={120}
              max={230}
              required
              defaultValue={170}
            />
          </div>
        </ToolFieldset>
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" variant="primary" size="lg">
            Calcular IMC
          </Button>
          <ToolDisclaimer />
        </div>
      </form>
      {result && (
        <ToolResultPanel
          badge={result.categoryLabel}
          subtitle={`IMC ${result.bmi}`}
          recommendations={result.recommendations}
        >
          <p className="text-muted text-pretty">{result.guidance}</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-sage-muted/50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Faixa OMS
              </dt>
              <dd className="mt-1 font-heading text-lg text-forest">
                {result.categoryLabel}
              </dd>
            </div>
            <div className="rounded-xl bg-sage-muted/50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                Índice
              </dt>
              <dd className="mt-1 font-heading text-xl text-forest">{result.bmi}</dd>
            </div>
          </dl>
        </ToolResultPanel>
      )}
    </div>
  );
}
