"use client";

import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import {
  evaluateBasalMetabolism,
  parseBasalMetabolismForm,
  type BasalMetabolismResult,
} from "@/lib/tools/basal-metabolism";
import { usePersistToolResult } from "@/lib/health-profile/use-persist-tool-result";
import { useState } from "react";
import { ToolDisclaimer, ToolFieldset, ToolResultPanel, scrollToResult } from "./tool-ui";

export function BasalMetabolismTool() {
  const [result, setResult] = useState<BasalMetabolismResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { persist, saved, status, message } = usePersistToolResult("metabolismo-basal");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const parsed = parseBasalMetabolismForm(new FormData(e.currentTarget));
    if ("error" in parsed) {
      setError(parsed.error);
      setResult(null);
      return;
    }
    const evaluated = evaluateBasalMetabolism(
      parsed.sex,
      parsed.age,
      parsed.weightKg,
      parsed.heightCm,
      parsed.activity,
    );
    setResult(evaluated);
    void persist(evaluated as unknown as Record<string, unknown>);
    scrollToResult();
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <ToolFieldset title="Dados para TMB (Mifflin-St Jeor)">
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              name="sex"
              label="Sexo biológico"
              options={[
                { value: "female", label: "Feminino" },
                { value: "male", label: "Masculino" },
              ]}
              defaultValue="female"
            />
            <Input
              name="age"
              type="number"
              label="Idade (anos)"
              min={15}
              max={100}
              required
              defaultValue={35}
            />
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
              defaultValue={165}
            />
          </div>
          <Select
            name="activity"
            label="Nível de atividade (fator do GET)"
            options={[
              { value: "sedentary", label: "Sedentário" },
              { value: "light", label: "Leve" },
              { value: "moderate", label: "Moderado" },
              { value: "active", label: "Intenso" },
              { value: "very_active", label: "Muito intenso" },
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
            Calcular metabolismo
          </Button>
          <ToolDisclaimer />
        </div>
      </form>
      {result && (
        <ToolResultPanel
          badge={`GET ~${result.tdeeKcal} kcal`}
          subtitle={`TMB ${result.bmrKcal} kcal`}
          recommendations={result.recommendations}
          saved={saved}
          saveStatus={status}
          saveMessage={message}
        >
          <p className="text-muted text-pretty">{result.guidance}</p>
          <p className="mt-3 text-sm text-muted">{result.activityLabel}</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-sage-muted/50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                TMB (basal)
              </dt>
              <dd className="mt-1 font-heading text-xl text-forest">
                {result.bmrKcal} kcal
              </dd>
            </div>
            <div className="rounded-xl bg-sage-muted/50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                GET estimado
              </dt>
              <dd className="mt-1 font-heading text-xl text-forest">
                {result.tdeeKcal} kcal
              </dd>
            </div>
          </dl>
        </ToolResultPanel>
      )}
    </div>
  );
}
