"use client";

import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import {
  evaluateDailyProtein,
  parseDailyProteinForm,
  type DailyProteinResult,
} from "@/lib/tools/daily-protein";
import { usePersistToolResult } from "@/lib/health-profile/use-persist-tool-result";
import { useState } from "react";
import { ToolDisclaimer, ToolFieldset, ToolResultPanel, scrollToResult } from "./tool-ui";

export function DailyProteinTool() {
  const [result, setResult] = useState<DailyProteinResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { persist, saved, status, message } = usePersistToolResult("proteina-diaria");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const parsed = parseDailyProteinForm(new FormData(e.currentTarget));
    if ("error" in parsed) {
      setError(parsed.error);
      setResult(null);
      return;
    }
    const evaluated = evaluateDailyProtein(
      parsed.weightKg,
      parsed.goal,
      parsed.activity,
    );
    setResult(evaluated);
    void persist(evaluated as unknown as Record<string, unknown>);
    scrollToResult();
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <ToolFieldset title="Objetivo e perfil">
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
          <Select
            name="goal"
            label="Objetivo principal"
            options={[
              { value: "maintenance", label: "Manutenção" },
              { value: "muscle", label: "Ganho / preservação muscular" },
              { value: "longevity", label: "Longevidade e saúde metabólica" },
              { value: "weight_loss", label: "Perda de gordura" },
            ]}
            defaultValue="maintenance"
          />
          <Select
            name="activity"
            label="Nível de atividade física"
            options={[
              { value: "sedentary", label: "Sedentário" },
              { value: "moderate", label: "Moderado" },
              { value: "active", label: "Ativo" },
            ]}
            defaultValue="moderate"
          />
        </ToolFieldset>
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" variant="primary" size="lg">
            Calcular proteína
          </Button>
          <ToolDisclaimer />
        </div>
      </form>
      {result && (
        <ToolResultPanel
          badge={`${result.gramsPerDay} g / dia`}
          subtitle={`${result.gramsPerKg} g por kg de peso`}
          recommendations={result.recommendations}
          saved={saved}
          saveStatus={status}
          saveMessage={message}
        >
          <p className="text-muted text-pretty">{result.guidance}</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-sage-muted/50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                3 refeições
              </dt>
              <dd className="mt-1 font-heading text-xl text-forest">
                ~{result.perMeal3} g cada
              </dd>
            </div>
            <div className="rounded-xl bg-sage-muted/50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                4 refeições
              </dt>
              <dd className="mt-1 font-heading text-xl text-forest">
                ~{result.perMeal4} g cada
              </dd>
            </div>
          </dl>
        </ToolResultPanel>
      )}
    </div>
  );
}
